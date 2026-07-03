/**
 * Core Application Logic for Minimalist CGPA Calculator.
 */

// Grade to point mapping
const GRADE_POINTS = {
  "O": 10,
  "A+": 9,
  "A": 8,
  "B+": 7,
  "B": 6,
  "C": 5,
  "U": 0
};

// Application State
let state = {
  currentCurriculum: "skcet_it_24_28", // default to SKCET curriculum
  currentLayout: "tabbed",           // default layout for minimalist tabs
  activeTabId: 1,                    // current active semester (1-8)
  activeMobileTab: "dashboard",      // active view on mobile screens (dashboard/courses)
  semesters: []
};

// Storage Helper: transparently uses Capacitor Preferences on Mobile, falling back to LocalStorage in web browsers.
const storage = {
  async get(key) {
    try {
      if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Preferences) {
        const { value } = await window.Capacitor.Plugins.Preferences.get({ key });
        return value;
      }
    } catch (e) {
      console.warn("Capacitor Preferences get failed, falling back to localStorage", e);
    }
    return localStorage.getItem(key);
  },
  async set(key, value) {
    try {
      if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Preferences) {
        await window.Capacitor.Plugins.Preferences.set({ key, value });
        return;
      }
    } catch (e) {
      console.warn("Capacitor Preferences set failed, falling back to localStorage", e);
    }
    localStorage.setItem(key, value);
  },
  async remove(key) {
    try {
      if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Preferences) {
        await window.Capacitor.Plugins.Preferences.remove({ key });
        return;
      }
    } catch (e) {
      console.warn("Capacitor Preferences remove failed, falling back to localStorage", e);
    }
    localStorage.removeItem(key);
  }
};

// Initialize Application
document.addEventListener("DOMContentLoaded", async () => {
  await initTheme();
  await loadStateOrPreset();
  renderApp();
  setupGlobalEvents();
  
  // Fade out loader after 3 seconds
  const loader = document.getElementById("app-loader");
  if (loader) {
    setTimeout(() => {
      loader.classList.add("opacity-0", "pointer-events-none");
      setTimeout(() => loader.remove(), 500); // completely remove from DOM after transition completes
    }, 3000);
  }
});

/* ==========================================
   STATE & DATA PERSISTENCE
   ========================================== */

/**
 * Loads saved state from localStorage or initializes default curriculum preset
 */
async function loadStateOrPreset() {
  const savedState = await storage.get("apex_gpa_state_min");
  
  if (savedState) {
    try {
      state = JSON.parse(savedState);
      
      // Migrate legacy F grades to U
      if (state.semesters) {
        state.semesters.forEach(sem => {
          if (sem.courses) {
            sem.courses.forEach(c => {
              if (c.grade === "F") c.grade = "U";
            });
          }
        });
      }
      
      // Ensure layout is locked to tabbed for minimalist requirements
      state.currentLayout = "tabbed";
      
      // Fallback for mobile tab state if missing
      if (!state.activeMobileTab) {
        state.activeMobileTab = "dashboard";
      }
      
      // Fallback if currentCurriculum is custom or invalid
      if (state.currentCurriculum === "custom" || !CURRICULUM_PRESETS[state.currentCurriculum]) {
        state.currentCurriculum = "skcet_it_24_28";
        state.semesters = JSON.parse(JSON.stringify(CURRICULUM_PRESETS.skcet_it_24_28.semesters));
        state.activeTabId = 1;
        state.semesters.forEach((sem) => {
          sem.expanded = (sem.id === state.activeTabId);
        });
        await saveState();
      }
      
      // Sync curriculum selector value
      const select = document.getElementById("curriculum-select");
      if (select) select.value = state.currentCurriculum;
      
      updateCurriculumDescription(state.currentCurriculum);
      
      // Automatically sync course credits and definitions from presets
      syncCreditsWithPresets();
    } catch (e) {
      console.error("Failed to parse saved state, loading default.", e);
      await loadPreset("skcet_it_24_28", false);
    }
  } else {
    await loadPreset("skcet_it_24_28", false);
  }
}

/**
 * Synchronizes course credits and names in the active state with their definitions in CURRICULUM_PRESETS.
 * This ensures that if credits or courses in the preset are corrected, the user's saved state is automatically updated
 * without losing their selected grades.
 */
function syncCreditsWithPresets() {
  const presetKey = state.currentCurriculum;
  if (!presetKey || !CURRICULUM_PRESETS[presetKey]) return;
  
  const preset = CURRICULUM_PRESETS[presetKey];
  let stateChanged = false;
  
  preset.semesters.forEach(presetSem => {
    // Find matching semester in state
    let stateSem = state.semesters.find(s => s.id === presetSem.id);
    if (!stateSem) {
      // If semester is missing in state, copy it from preset
      stateSem = JSON.parse(JSON.stringify(presetSem));
      stateSem.expanded = (stateSem.id === state.activeTabId);
      state.semesters.push(stateSem);
      state.semesters.sort((a, b) => a.id - b.id);
      stateChanged = true;
      return;
    }
    
    // Check if the semester in state is "dirty" (i.e. has any grades entered)
    const isDirty = stateSem.courses.some(c => c.grade !== "");
    
    if (!isDirty) {
      // If no grades are entered in this semester, completely reload courses from preset to capture any new/changed courses
      const newCoursesStr = JSON.stringify(presetSem.courses);
      const oldCoursesStr = JSON.stringify(stateSem.courses.map(c => ({ code: c.code, name: c.name, credits: c.credits, grade: "" })));
      
      if (newCoursesStr !== oldCoursesStr) {
        stateSem.courses = JSON.parse(JSON.stringify(presetSem.courses));
        stateChanged = true;
      }
    } else {
      // If grades are entered, we do a granular sync to preserve grades
      presetSem.courses.forEach(presetCourse => {
        if (!presetCourse.code) return; // skip custom rows without code
        
        // Find course in state semester by code
        const stateCourse = stateSem.courses.find(c => c.code === presetCourse.code);
        if (stateCourse) {
          // Sync credits if they differ
          if (stateCourse.credits !== presetCourse.credits) {
            console.log(`Syncing credits for ${presetCourse.code}: ${stateCourse.credits} -> ${presetCourse.credits}`);
            stateCourse.credits = presetCourse.credits;
            stateChanged = true;
          }
          // Sync name if it differs
          if (stateCourse.name !== presetCourse.name) {
            stateCourse.name = presetCourse.name;
            stateChanged = true;
          }
        } else {
          // Course from preset is missing in state, add it
          stateSem.courses.push(JSON.parse(JSON.stringify(presetCourse)));
          stateChanged = true;
        }
      });
      
      // Clean up courses in state that have codes but are not in the preset anymore and have no grade
      for (let i = stateSem.courses.length - 1; i >= 0; i--) {
        const stateCourse = stateSem.courses[i];
        if (stateCourse.code) {
          const existsInPreset = presetSem.courses.some(c => c.code === stateCourse.code);
          if (!existsInPreset && stateCourse.grade === "") {
            stateSem.courses.splice(i, 1);
            stateChanged = true;
          }
        }
      }
    }
  });
  
  if (stateChanged) {
    saveState();
  }
}

/**
 * Saves current application state to localStorage
 */
async function saveState() {
  await storage.set("apex_gpa_state_min", JSON.stringify(state));
}

/**
 * Loads a specific curriculum preset, resetting input states
 */
async function loadPreset(presetKey, shouldNotify = true) {
  const actualKey = CURRICULUM_PRESETS[presetKey] ? presetKey : "skcet_it_24_28";
  const preset = CURRICULUM_PRESETS[actualKey];
  
  state.currentCurriculum = actualKey;
  state.semesters = JSON.parse(JSON.stringify(preset.semesters));
  
  // By default expand only the active tab, rest are collapsed
  state.semesters.forEach((sem) => {
    sem.expanded = (sem.id === state.activeTabId);
  });
  
  await saveState();
  updateCurriculumDescription(presetKey);
}

function updateCurriculumDescription(presetKey) {
  const descEl = document.getElementById("curriculum-description");
  if (descEl && CURRICULUM_PRESETS[presetKey]) {
    descEl.textContent = CURRICULUM_PRESETS[presetKey].description;
  }
}

/* ==========================================
   UI RENDERING AND LAYOUTS
   ========================================== */

/**
 * Master render function that draws the interface elements
 */
function renderApp() {
  renderLeftPanel();
  renderRightPanel();
  calculateAll();
  
  // Apply mobile navigation states
  if (state.activeMobileTab) {
    switchMobileTab(state.activeMobileTab, false);
  }
}

/**
 * Switches active panel layout visible on mobile viewports
 * @param {string} tabName - 'dashboard' or 'courses'
 * @param {boolean} shouldSave - Whether to trigger state save
 */
function switchMobileTab(tabName, shouldSave = true) {
  state.activeMobileTab = tabName;
  if (shouldSave) saveState();
  
  const leftPanel = document.getElementById("left-panel");
  const rightPanel = document.getElementById("right-panel");
  const navContainer = document.getElementById("mobile-nav-container");
  
  if (tabName === "dashboard") {
    if (leftPanel) leftPanel.classList.remove("mobile-hidden");
    if (rightPanel) rightPanel.classList.add("mobile-hidden");
    
    if (navContainer) {
      navContainer.classList.add("nav-dashboard-active");
      navContainer.classList.remove("nav-courses-active");
    }
  } else {
    if (leftPanel) leftPanel.classList.add("mobile-hidden");
    if (rightPanel) rightPanel.classList.remove("mobile-hidden");
    
    if (navContainer) {
      navContainer.classList.remove("nav-dashboard-active");
      navContainer.classList.add("nav-courses-active");
    }
  }
}

/**
 * Renders the Semester Tabs labeled Sem 1 through Sem 8
 */
function renderLeftPanel() {
  const container = document.getElementById("left-panel-content");
  if (!container) return;
  
  // Pre-calculate live metrics for the left panel to avoid "0.00" blinking on DOM recreation
  let totalCreditsForCgpa = 0;
  let totalPointsForCgpa = 0;
  let totalOverallCreditsEarned = 0;
  let activeSemesterCount = 0;
  
  state.semesters.forEach(sem => {
    let gradedCreditsCount = 0;
    let weightedPointsCount = 0;
    let semesterTotalCredits = 0;
    
    sem.courses.forEach(course => {
      semesterTotalCredits += course.credits;
      
      if (course.grade !== "" && GRADE_POINTS[course.grade] !== undefined) {
        const points = GRADE_POINTS[course.grade];
        gradedCreditsCount += course.credits;
        weightedPointsCount += (course.credits * points);
      }
    });

    if (sem.included) {
      totalOverallCreditsEarned += semesterTotalCredits;
      activeSemesterCount++;
    }
    
    sem.computedSgpa = gradedCreditsCount > 0 ? weightedPointsCount / gradedCreditsCount : 0;
    sem.gradedCredits = gradedCreditsCount;
    
    if (sem.included && gradedCreditsCount > 0) {
      totalCreditsForCgpa += gradedCreditsCount;
      totalPointsForCgpa += weightedPointsCount;
    }
  });

  let cgpa = totalCreditsForCgpa > 0 ? totalPointsForCgpa / totalCreditsForCgpa : 0;
  const cgpaColorClass = totalCreditsForCgpa === 0 ? "text-slate-500 dark:text-slate-400" :
                         cgpa >= 8.5 ? "text-emerald-500 dark:text-emerald-400" :
                         cgpa >= 7.0 ? "text-blue-600 dark:text-blue-400" :
                         cgpa >= 5.0 ? "text-amber-500 dark:text-amber-400" : "text-rose-500 dark:text-rose-400";
                         
  const cgpaPercent = (cgpa / 10.0) * 100;
  const strokeOffset = 119.38 - (cgpaPercent / 100) * 119.38;
  
  container.innerHTML = `
    <!-- CGPA Card -->
    <div class="minimal-card p-5 mb-3">
      <div class="flex items-start justify-between">
        <div class="flex flex-col gap-1">
          <span class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Overall CGPA</span>
          <div class="flex items-baseline gap-1.5">
            <span id="live-cgpa" class="text-4xl font-extrabold transition-all duration-300 cgpa-number ${cgpaColorClass}">${cgpa.toFixed(2)}</span>
            <span class="text-xs font-semibold text-slate-400">/ 10.0</span>
          </div>
          <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug" id="curriculum-description">
            Select your course credits and grade points to calculate your CGPA.
          </p>
        </div>

        <!-- Radial Gauge (small) -->
        <div class="relative flex items-center justify-center h-16 w-16 shrink-0 mt-1">
          <svg class="w-full h-full -rotate-90" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="19" stroke="currentColor" stroke-width="3.5" class="text-slate-100 dark:text-slate-700" fill="transparent" />
            <circle id="cgpa-progress-circle" cx="24" cy="24" r="19" stroke="currentColor" stroke-width="4" stroke-dasharray="119.38" stroke-dashoffset="${strokeOffset}" stroke-linecap="round" fill="transparent" class="text-blue-500 progress-ring-circle" />
          </svg>
          <span id="live-cgpa-percentage" class="absolute text-[10px] font-extrabold text-slate-600 dark:text-slate-300">${Math.round(cgpaPercent)}%</span>
        </div>
      </div>

      <!-- Metrics Row -->
      <div class="flex items-center gap-6 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
        <div>
          <span class="text-[9px] block font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Total Credits</span>
          <span id="live-credits" class="text-lg font-bold text-slate-700 dark:text-slate-200">${totalOverallCreditsEarned}</span>
        </div>
        <div class="w-px h-5 bg-slate-200 dark:bg-slate-800"></div>
        <div>
          <span class="text-[9px] block font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Semesters</span>
          <span id="active-sem-count" class="text-lg font-bold text-slate-700 dark:text-slate-200">${activeSemesterCount}</span>
        </div>
      </div>
    </div>

    <!-- Semester Tabs Card -->
    <div class="minimal-card p-4">
      <div class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Semesters</div>
      <div class="grid grid-cols-3 gap-2" id="semester-tab-grid"></div>
    </div>
  `;

  renderSemesterTabs();
}

function renderSemesterTabs() {
  const grid = document.getElementById("semester-tab-grid");
  if (!grid) return;

  grid.innerHTML = "";

  state.semesters.forEach(sem => {
    const isActive = state.activeTabId === sem.id;
    const sgpa = sem.computedSgpa || 0;
    const hasGrade = sem.gradedCredits > 0;

    const tab = document.createElement("button");
    tab.className = `sem-tab ${isActive ? 'active' : ''} text-left`;

    let sgpaColor = "text-slate-400 dark:text-slate-600";
    if (hasGrade) {
      sgpaColor = sgpa >= 8.5 ? "text-emerald-500" :
                  sgpa >= 7.0 ? "text-blue-500" :
                  sgpa >= 5.0 ? "text-amber-500" : "text-rose-500";
    }

    tab.innerHTML = `
      <div class="flex items-center justify-between mb-1">
        <span class="text-xs font-bold text-slate-700 dark:text-slate-200">Sem ${sem.id}</span>
        ${sem.included
          ? '<span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>'
          : '<span class="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></span>'
        }
      </div>
      <span class="sem-tab-sgpa ${sgpaColor}">
        ${hasGrade ? sgpa.toFixed(1) : '—'}
      </span>
    `;

    tab.addEventListener("click", () => {
      state.activeTabId = sem.id;
      state.semesters.forEach(s => { s.expanded = (s.id === sem.id); });
      
      // Auto-switch to courses panel on mobile devices
      if (window.innerWidth < 768) {
        state.activeMobileTab = "courses";
      }
      
      saveState();
      renderApp();
    });

    grid.appendChild(tab);
  });
}

function renderRightPanel() {
  const container = document.getElementById("right-panel-content");
  if (!container) return;

  const sem = state.semesters.find(s => s.id === state.activeTabId);
  if (!sem) return;

  const checkedAttr = sem.included ? "checked" : "";

  container.innerHTML = `
    <div class="minimal-card p-4 md:p-6 h-full flex flex-col overflow-hidden">
      <!-- Semester Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5 mb-5">
        <div class="flex items-center justify-between md:justify-start gap-4 w-full md:w-auto">
          <div>
            <h2 class="text-lg font-bold flex items-center gap-2">
              <span>${sem.name}</span>
              <span class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                sem.included
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400"
                  : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
              }">
                ${sem.included ? "Included" : "Excluded"}
              </span>
            </h2>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" class="sr-only peer" ${checkedAttr} onchange="toggleSemesterInclusion(${sem.id}, this)">
            <div class="w-9 h-5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div class="grid grid-cols-3 md:flex items-center gap-2 md:gap-6 w-full md:w-auto bg-slate-50/50 dark:bg-slate-900/20 md:bg-transparent p-3 md:p-0 rounded-2xl md:rounded-none border border-slate-200/30 dark:border-slate-800/10 md:border-0 text-center md:text-left">
          <div class="flex flex-col md:items-end">
            <span class="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">Grade Points</span>
            <span id="sem-points-total-${sem.id}" class="text-base md:text-xl font-extrabold text-slate-700 dark:text-slate-200 font-mono">0</span>
          </div>
          <div class="hidden md:block h-8 w-px bg-slate-200 dark:bg-slate-800"></div>
          <div class="flex flex-col md:items-end">
            <span class="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">SGPA</span>
            <span id="sgpa-display-${sem.id}" class="text-base md:text-xl font-extrabold text-slate-700 dark:text-slate-200 font-mono">—</span>
          </div>
          <div class="hidden md:block h-8 w-px bg-slate-200 dark:bg-slate-800"></div>
          <div class="flex flex-col md:items-end">
            <span class="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">Credits</span>
            <span id="sem-credits-total-${sem.id}" class="text-base md:text-xl font-extrabold text-slate-700 dark:text-slate-200">0</span>
          </div>
        </div>
      </div>

      <!-- Column labels -->
      <div class="hidden md:grid grid-cols-12 gap-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 px-2">
        <div class="col-span-2">Course Code</div>
        <div class="col-span-6">Course Title</div>
        <div class="col-span-2 text-center">Credits</div>
        <div class="col-span-2 text-center">Grade</div>
      </div>

      <!-- Rows Container -->
      <div id="subject-rows-container-${sem.id}" class="flex-1 overflow-y-auto flex flex-col gap-2 pr-1 pb-20 md:pb-4">
      </div>
    </div>
  `;

  renderCourseRows(sem.id);
}

function renderCourseRows(semId) {
  const sem = state.semesters.find(s => s.id === semId);
  if (!sem) return;
  
  const container = document.getElementById(`subject-rows-container-${semId}`);
  if (!container) return;
  
  container.innerHTML = "";
  
  if (sem.courses.length === 0) {
    container.innerHTML = `
      <div class="text-center py-10 text-slate-400 dark:text-slate-500 text-xs">
        <i class="fa-regular fa-folder-open block text-2xl mb-2 opacity-40"></i>
        No subjects in this semester.
      </div>
    `;
    return;
  }

  sem.courses.forEach((course, courseIdx) => {
    const row = document.createElement("div");
    row.className = "row-fade-in flex flex-col md:grid md:grid-cols-12 items-start md:items-center gap-3 bg-slate-50/50 dark:bg-slate-900/20 border border-slate-200/30 dark:border-slate-800/10 p-3 md:px-3 md:py-2.5 rounded-xl hover:border-blue-500/30 hover:bg-blue-50/30 dark:hover:bg-blue-950/10 dark:hover:border-blue-500/20 transition-all duration-150 group w-full";
    
    let gradeBorderClass = "";
    if (course.grade !== "") {
      gradeBorderClass = `grade-badge-${course.grade.replace("+", "plus")}`;
    }

    row.innerHTML = `
      <!-- Mobile Layout: Code, Title (visible on mobile only) -->
      <div class="flex items-start justify-between w-full md:hidden mb-1">
        <div class="flex flex-col gap-1 min-w-0 pr-2">
          ${course.code ? `<span class="inline-block text-[9px] font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20 px-2 py-0.5 rounded-md self-start">${course.code}</span>` : ''}
          <h3 class="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">${course.name || 'Custom Subject'}</h3>
        </div>
      </div>

      <!-- Desktop Inputs: Code & Title (hidden on mobile, visible on desktop) -->
      <div class="hidden md:block col-span-2">
        <input type="text" readonly class="w-full minimal-input text-sm md:text-base px-3 py-2" placeholder="Code" value="${course.code || ''}">
      </div>

      <div class="hidden md:block col-span-6">
        <input type="text" readonly class="w-full minimal-input text-sm md:text-base px-3 py-2 font-medium" placeholder="Subject Title" value="${course.name || ''}">
      </div>

      <!-- Mobile Grid for Selectors: Credits & Grade (visible on mobile only) -->
      <div class="grid grid-cols-2 gap-3 w-full md:hidden">
        <div class="flex flex-col gap-1">
          <label class="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Credits</label>
          <select class="w-full minimal-input text-xs cursor-pointer px-2.5 py-2" onchange="updateCourseField(${semId}, ${courseIdx}, 'credits', parseInt(this.value) || 0)">
            ${Array.from({length: 16}, (_, i) => {
              const selected = course.credits === i ? "selected" : "";
              return `<option value="${i}" ${selected}>${i} Credits</option>`;
            }).join('')}
          </select>
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Grade</label>
          <select class="w-full minimal-input text-xs font-bold cursor-pointer px-2.5 py-2 ${gradeBorderClass}" onchange="updateCourseGrade(${semId}, ${courseIdx}, this.value)">
            <option value="" ${course.grade === "" ? 'selected' : ''}>Select Grade</option>
            <option value="O" ${course.grade === "O" ? 'selected' : ''}>O (10)</option>
            <option value="A+" ${course.grade === "A+" ? 'selected' : ''}>A+ (9)</option>
            <option value="A" ${course.grade === "A" ? 'selected' : ''}>A (8)</option>
            <option value="B+" ${course.grade === "B+" ? 'selected' : ''}>B+ (7)</option>
            <option value="B" ${course.grade === "B" ? 'selected' : ''}>B (6)</option>
            <option value="C" ${course.grade === "C" ? 'selected' : ''}>C (5)</option>
            <option value="U" ${course.grade === "U" ? 'selected' : ''}>U (0)</option>
          </select>
        </div>
      </div>

      <!-- Desktop Inputs: Credits & Grade (hidden on mobile, visible on desktop) -->
      <div class="hidden md:block col-span-2 text-center">
        <select class="w-full minimal-input text-sm md:text-base cursor-pointer px-2.5 py-2 text-center" onchange="updateCourseField(${semId}, ${courseIdx}, 'credits', parseInt(this.value) || 0)">
          ${Array.from({length: 16}, (_, i) => {
            const selected = course.credits === i ? "selected" : "";
            return `<option value="${i}" ${selected}>${i}</option>`;
          }).join('')}
        </select>
      </div>

      <div class="hidden md:block col-span-2 text-center">
        <select class="w-full minimal-input text-sm md:text-base font-bold cursor-pointer px-2.5 py-2 text-center ${gradeBorderClass}" onchange="updateCourseGrade(${semId}, ${courseIdx}, this.value)">
          <option value="" ${course.grade === "" ? 'selected' : ''}>—</option>
          <option value="O" ${course.grade === "O" ? 'selected' : ''}>O (10)</option>
          <option value="A+" ${course.grade === "A+" ? 'selected' : ''}>A+ (9)</option>
          <option value="A" ${course.grade === "A" ? 'selected' : ''}>A (8)</option>
          <option value="B+" ${course.grade === "B+" ? 'selected' : ''}>B+ (7)</option>
          <option value="B" ${course.grade === "B" ? 'selected' : ''}>B (6)</option>
          <option value="C" ${course.grade === "C" ? 'selected' : ''}>C (5)</option>
          <option value="U" ${course.grade === "U" ? 'selected' : ''}>U (0)</option>
        </select>
      </div>
    `;
    
    container.appendChild(row);
  });
}

/* ==========================================
   MUTATORS & VALUE HANDLERS
   ========================================== */

window.updateCourseField = function(semId, courseIdx, field, value) {
  const sem = state.semesters.find(s => s.id === semId);
  if (!sem || !sem.courses[courseIdx]) return;
  
  sem.courses[courseIdx][field] = value;
  saveState();
  calculateAll();
  renderSemesterTabs();
};

window.updateCourseGrade = function(semId, courseIdx, grade) {
  const sem = state.semesters.find(s => s.id === semId);
  if (!sem || !sem.courses[courseIdx]) return;
  
  sem.courses[courseIdx].grade = grade;
  saveState();
  renderCourseRows(semId);
  calculateAll();
  renderSemesterTabs();
};

window.toggleSemesterInclusion = function(semId, checkbox) {
  const sem = state.semesters.find(s => s.id === semId);
  if (!sem) return;
  
  sem.included = checkbox.checked;
  saveState();
  
  renderApp();
};

/* ==========================================
   CALCULATION LOGIC
   ========================================== */

function calculateAll() {
  let totalCreditsForCgpa = 0;
  let totalPointsForCgpa = 0;
  let totalOverallCreditsEarned = 0;
  let activeSemesterCount = 0;
  
  state.semesters.forEach(sem => {
    let gradedCreditsCount = 0;
    let weightedPointsCount = 0;
    let semesterTotalCredits = 0;
    
    sem.courses.forEach(course => {
      semesterTotalCredits += course.credits;
      
      if (course.grade !== "" && GRADE_POINTS[course.grade] !== undefined) {
        const points = GRADE_POINTS[course.grade];
        gradedCreditsCount += course.credits;
        weightedPointsCount += (course.credits * points);
      }
    });

    if (sem.included) {
      totalOverallCreditsEarned += semesterTotalCredits;
    }
    
    // Update active semester total credits display in UI
    const creditFooter = document.getElementById(`sem-credits-total-${sem.id}`);
    if (creditFooter) {
      creditFooter.textContent = semesterTotalCredits;
    }

    const pointsEl = document.getElementById(`sem-points-total-${sem.id}`);
    if (pointsEl) {
      pointsEl.textContent = weightedPointsCount;
    }
    
    // SGPA computation
    let sgpa = 0;
    const displayEl = document.getElementById(`sgpa-display-${sem.id}`);
    
    if (gradedCreditsCount > 0) {
      sgpa = weightedPointsCount / gradedCreditsCount;
      if (displayEl) {
        displayEl.textContent = sgpa.toFixed(2);
        displayEl.className = `text-xl font-extrabold font-mono ${
          sgpa >= 8.5 ? "text-emerald-500 dark:text-emerald-400" :
          sgpa >= 7.0 ? "text-blue-500 dark:text-blue-400" :
          sgpa >= 5.0 ? "text-amber-500 dark:text-amber-400" : "text-rose-500"
        }`;
      }
    } else {
      if (displayEl) {
        displayEl.textContent = "—";
        displayEl.className = "text-xl font-extrabold text-slate-400 dark:text-slate-600 font-mono";
      }
    }
    
    sem.computedSgpa = sgpa;
    sem.gradedCredits = gradedCreditsCount;
    
    if (sem.included && gradedCreditsCount > 0) {
      totalCreditsForCgpa += gradedCreditsCount;
      totalPointsForCgpa += weightedPointsCount;
    }
    
    if (sem.included) {
      activeSemesterCount++;
    }
  });
  
  // Overall CGPA
  let cgpa = 0;
  if (totalCreditsForCgpa > 0) {
    cgpa = totalPointsForCgpa / totalCreditsForCgpa;
  }
  
  const cgpaEl = document.getElementById("live-cgpa");
  if (cgpaEl) {
    cgpaEl.textContent = cgpa.toFixed(2);
    cgpaEl.className = `text-5xl md:text-6xl font-extrabold transition-colors duration-300 ${
      totalCreditsForCgpa === 0 ? "text-slate-500 dark:text-slate-400" :
      cgpa >= 8.5 ? "text-emerald-500 dark:text-emerald-400" :
      cgpa >= 7.0 ? "text-blue-600 dark:text-blue-400" :
      cgpa >= 5.0 ? "text-amber-500 dark:text-amber-400" : "text-rose-500 dark:text-rose-400"
    }`;
  }
  
  // Total Credits Display
  const creditsEl = document.getElementById("live-credits");
  if (creditsEl) creditsEl.textContent = totalOverallCreditsEarned;
  
  // Active Semester Count Display
  const activeSemEl = document.getElementById("active-sem-count");
  if (activeSemEl) activeSemEl.textContent = activeSemesterCount;
  
  // Radial Circle Gauge Update (Radius 19 -> Circumference = 119.38)
  const circle = document.getElementById("cgpa-progress-circle");
  const percentageEl = document.getElementById("live-cgpa-percentage");
  
  if (circle) {
    const cgpaPercent = (cgpa / 10.0) * 100;
    const offset = 119.38 - (cgpaPercent / 100) * 119.38;
    circle.style.strokeDashoffset = offset;
    
    if (percentageEl) {
      percentageEl.textContent = `${Math.round(cgpaPercent)}%`;
    }
  }
}

/* ==========================================
   THEME SWITCHING & UTILITIES
   ========================================== */

async function initTheme() {
  // Default to light theme as requested in redesign prompt
  const savedTheme = await storage.get("apex_gpa_theme") || "light";
  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

async function toggleTheme() {
  const html = document.documentElement;
  if (html.classList.contains("dark")) {
    html.classList.remove("dark");
    await storage.set("apex_gpa_theme", "light");
  } else {
    html.classList.add("dark");
    await storage.set("apex_gpa_theme", "dark");
  }
}



/* ==========================================
   GLOBAL LISTENERS
   ========================================== */

function setupGlobalEvents() {
  
  // Scroll shadow for glass navbar
  const header = document.getElementById("main-header");
  if (header) {
    window.addEventListener("scroll", () => {
      header.classList.toggle("header-shadow", window.scrollY > 8);
    });
  }

  // Theme switcher
  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }
    
  // Curriculum loader
  const currSelect = document.getElementById("curriculum-select");
  if (currSelect) {
    currSelect.addEventListener("change", (e) => {
      loadPreset(e.target.value);
      renderApp();
    });
  }
  
  // Mobile bottom tab navigation listeners
  const mobDashboardBtn = document.getElementById("mobile-tab-dashboard");
  const mobCoursesBtn = document.getElementById("mobile-tab-courses");
  
  if (mobDashboardBtn) {
    mobDashboardBtn.addEventListener("click", () => {
      switchMobileTab("dashboard");
    });
  }
  if (mobCoursesBtn) {
    mobCoursesBtn.addEventListener("click", () => {
      switchMobileTab("courses");
    });
  }
  
  // Reset confirmation modal triggers
  const resetBtn = document.getElementById("global-reset-btn");
  const modal = document.getElementById("reset-modal");
  const modalCancel = document.getElementById("modal-cancel-btn");
  const modalConfirm = document.getElementById("modal-confirm-btn");
  
  if (resetBtn && modal) {
    resetBtn.addEventListener("click", () => {
      modal.classList.remove("hidden");
      setTimeout(() => {
        modal.classList.remove("opacity-0");
        modal.querySelector("div").classList.remove("scale-95");
      }, 50);
    });
  }
  
  const closeModal = () => {
    if (!modal) return;
    modal.classList.add("opacity-0");
    modal.querySelector("div").classList.add("scale-95");
    setTimeout(() => {
      modal.classList.add("hidden");
    }, 250);
  };
  
  if (modalCancel) modalCancel.addEventListener("click", closeModal);
  
  if (modalConfirm) {
    modalConfirm.addEventListener("click", async () => {
      await storage.remove("apex_gpa_state_min");
      
      const currSelect = document.getElementById("curriculum-select");
      if (currSelect) currSelect.value = "skcet_it_24_28";
      
      state.activeTabId = 1;
      state.activeMobileTab = "dashboard";
      await loadPreset("skcet_it_24_28", false);
      closeModal();
      renderApp();
    });
  }
}
