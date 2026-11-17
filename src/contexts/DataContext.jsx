import { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { CURRICULUM_PRESETS } from '../data/curriculum';

const skipCourse = c => !c.name.includes('Environmental Sciences');

function loadSemesters() {
  const key = 'cgpa_app_semesters';
  const preset = CURRICULUM_PRESETS.skcet_it_24_28.semesters;
  const saved = localStorage.getItem(key);
  let savedSemesters = [];
  if (saved) {
    try { savedSemesters = JSON.parse(saved); } catch { savedSemesters = []; }
  }
  // Always start from the preset structure (3 subjects per semester),
  // but preserve saved grades by matching subject index.
  return preset.map((sem, sIdx) => {
    const savedSem = savedSemesters[sIdx];
    const savedCourses = savedSem?.courses || [];
    return {
      id: sem.id,
      name: sem.name,
      included: sem.included,
      courses: sem.courses.map((c, cIdx) => {
        const savedCourse = savedCourses[cIdx];
        return {
          name: `Subject ${cIdx + 1}`,
          credits: c.credits,
          grade: savedCourse?.grade || '',
        };
      }),
    };
  });
}

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [semesters, setSemesters] = useState(() => loadSemesters());

  const [currentSemesterId, setCurrentSemesterId] = useState(1);

  const [gradeScaleRules, setGradeScaleRules] = useState([
    { grade: 'O', point: 10, range: '91–100%', bg: 'bg-[#D4E8D6] text-[#4A6E4D] border-[#B8D4BB]' },
    { grade: 'A+', point: 9, range: '81–90%', bg: 'bg-primary-light text-primary-hover border-primary-light/60' },
    { grade: 'A', point: 8, range: '71–80%', bg: 'bg-amber-100 text-amber-800 border-amber-200' },
    { grade: 'B+', point: 7, range: '61–70%', bg: 'bg-orange-100 text-orange-800 border-orange-200' },
    { grade: 'B', point: 6, range: '56–60%', bg: 'bg-stone-200 text-stone-800 border-stone-300' },
    { grade: 'C', point: 5, range: '50–55%', bg: 'bg-stone-100 text-stone-600 border-stone-200' },
    { grade: 'U', point: 0, range: '< 50% (Reappear)', bg: 'bg-danger/10 text-danger border-danger/20' }
  ]);

  // Memoize grade points map
  const gradePointsMap = useMemo(() => Object.fromEntries(gradeScaleRules.map(r => [r.grade, r.point])), [gradeScaleRules]);

  // Active semester
  const activeSemester = useMemo(() => {
    return semesters.find(s => s.id === currentSemesterId) || semesters[0] || { courses: [], included: true };
  }, [semesters, currentSemesterId]);

  // Active semester SGPA & totals calculation
  const semesterCalculations = useMemo(() => {
    let earnedPoints = 0;
    let earnedCredits = 0;

    (activeSemester.courses || []).forEach(c => {
      if (c.grade && gradePointsMap.hasOwnProperty(c.grade)) {
        const pts = gradePointsMap[c.grade];
        earnedPoints += c.credits * pts;
        earnedCredits += c.credits;
      }
    });

    const sgpa = earnedCredits > 0 ? (earnedPoints / earnedCredits) : 0;
    return {
      sgpa,
      totalCredits: earnedCredits,
      totalGradePoints: earnedPoints
    };
  }, [activeSemester, gradePointsMap]);

  // Cumulative CGPA calculation across all INCLUDED semesters
  const overallCgpaCalculations = useMemo(() => {
    let totalCumPoints = 0;
    let totalCumCredits = 0;

    semesters.forEach(sem => {
      if (sem.included !== false) {
        (sem.courses || []).forEach(c => {
          if (c.grade && gradePointsMap.hasOwnProperty(c.grade)) {
            const pts = gradePointsMap[c.grade];
            totalCumPoints += c.credits * pts;
            totalCumCredits += c.credits;
          }
        });
      }
    });

    const cgpa = totalCumCredits > 0 ? (totalCumPoints / totalCumCredits) : 0;

    return {
      cgpa,
      totalCumCredits,
      totalCumPoints
    };
  }, [semesters, gradePointsMap]);

  // Course & Semester handlers
  const handleUpdateCourse = (courseIndex, updatedCourse) => {
    setSemesters(prev => prev.map(s => {
      if (s.id === currentSemesterId) {
        const newCourses = [...(s.courses || [])];
        newCourses[courseIndex] = updatedCourse;
        return { ...s, courses: newCourses };
      }
      return s;
    }));
  };

  const handleAddSubject = () => {
    setSemesters(prev => prev.map(s => {
      if (s.id === currentSemesterId) {
        const newCourses = [...(s.courses || [])];
        const nextNum = newCourses.length + 1;
        newCourses.push({
          name: `Subject ${nextNum}`,
          credits: 3,
          grade: ''
        });
        return { ...s, courses: newCourses };
      }
      return s;
    }));
  };

  const handleRemoveSubject = (courseIndex) => {
    setSemesters(prev => prev.map(s => {
      if (s.id === currentSemesterId) {
        const newCourses = [...(s.courses || [])];
        newCourses.splice(courseIndex, 1);
        return { ...s, courses: newCourses };
      }
      return s;
    }));
  };

  const handleResetGrades = (scope = 'all') => {
    setSemesters(prev => prev.map(s => {
      if (scope === 'current' && s.id !== currentSemesterId) return s;
      return { ...s, courses: (s.courses || []).map(c => ({ ...c, grade: '' })) };
    }));
  };

  const handleSetCurrentSemester = (id) => setCurrentSemesterId(id);

  const handleUpdateGradeScale = (rules) => setGradeScaleRules(rules);

  const handleToggleSemesterInclusion = () => {
    setSemesters(prev => prev.map(s =>
      s.id === currentSemesterId
        ? { ...s, included: s.included === false }
        : s
    ));
  };

  // Persist semesters to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('cgpa_app_semesters', JSON.stringify(semesters));
  }, [semesters]);

  const value = useMemo(() => ({
    semesters,
    currentSemesterId,
    gradeScaleRules,
    gradePointsMap,
    activeSemester,
    semesterCalculations,
    overallCgpaCalculations,
    handleSetCurrentSemester,
    handleUpdateGradeScale,
    handleUpdateCourse,
    handleResetGrades,
    handleAddSubject,
    handleRemoveSubject,
    handleToggleSemesterInclusion
  }), [semesters, currentSemesterId, gradeScaleRules, gradePointsMap, activeSemester, semesterCalculations, overallCgpaCalculations]);

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
