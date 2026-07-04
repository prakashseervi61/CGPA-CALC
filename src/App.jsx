import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import RightPanel from './components/layout/RightPanel';
import SubjectTable from './components/dashboard/SubjectTable';
import GradeScale from './components/dashboard/GradeScale';
import CGPATrendsPage from './components/dashboard/CGPATrendsPage';
import SettingsPage from './components/dashboard/SettingsPage';
import HelpPage from './components/dashboard/HelpPage';
import LoginModal from './components/auth/LoginModal';
import Card from './components/ui/Card';
import Button from './components/ui/Button';
import { CURRICULUM_PRESETS } from './data/curriculum';
import { 
  TrendingUp, 
  Settings, 
  HelpCircle
} from 'lucide-react';

const GRADE_POINTS_DEFAULT = {
  'O': 10,
  'A+': 9,
  'A': 8,
  'B+': 7,
  'B': 6,
  'C': 5,
  'U': 0
};

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentSemesterId, setCurrentSemesterId] = useState(1);

  // Multi-user profiles list state
  const [savedProfiles, setSavedProfiles] = useState(() => {
    const saved = localStorage.getItem('cgpa_app_profiles');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return [];
  });

  // Currently logged-in active user profile
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('cgpa_app_current_user');
    if (savedUser) {
      try { return JSON.parse(savedUser); } catch (e) { }
    }
    return null;
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const savedUser = localStorage.getItem('cgpa_app_current_user');
    return !!savedUser;
  });

  const handleLogin = (profile) => {
    setUser(profile);
    setIsLoggedIn(true);
    localStorage.setItem('cgpa_app_current_user', JSON.stringify(profile));

    // Save profile to profiles list if not present
    setSavedProfiles(prev => {
      const exists = prev.some(p => (p.studentId && p.studentId === profile.studentId) || (p.id && p.id === profile.id));
      if (!exists) {
        const updated = [...prev, profile];
        localStorage.setItem('cgpa_app_profiles', JSON.stringify(updated));
        return updated;
      }
      return prev;
    });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('cgpa_app_current_user');
  };

  const handleDeleteProfile = (profileId) => {
    setSavedProfiles(prev => {
      const updated = prev.filter(p => p.id !== profileId && p.studentId !== profileId);
      localStorage.setItem('cgpa_app_profiles', JSON.stringify(updated));
      return updated;
    });
  };

  const handleUpdateUser = (updatedProfile) => {
    setUser(updatedProfile);
    localStorage.setItem('cgpa_app_current_user', JSON.stringify(updatedProfile));
    setSavedProfiles(prev => prev.map(p => (p.id === updatedProfile.id || p.studentId === updatedProfile.studentId) ? updatedProfile : p));
  };

  const handleResetGrades = () => {
    setSemesters(prev => prev.map(s => ({
      ...s,
      courses: (s.courses || []).map(c => ({ ...c, grade: '' }))
    })));
  };

  const handleExportData = () => {
    const headers = ['Semester', 'Subject Code', 'Subject Name', 'Credits', 'Grade', 'Grade Point'];
    const rows = [];

    semesters.forEach(sem => {
      (sem.courses || []).forEach(course => {
        const point = course.grade ? (gradePointsMap[course.grade] ?? 0) : '';
        rows.push([
          `"${sem.name}"`,
          `"${course.code || ''}"`,
          `"${(course.name || '').replace(/"/g, '""')}"`,
          course.credits,
          `"${course.grade || ''}"`,
          point !== '' ? point : ''
        ]);
      });
    });

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `cgpa_report_${user?.studentId || 'student'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [gradeScaleRules, setGradeScaleRules] = useState([
    { grade: 'O', point: 10, range: '91–100%', bg: 'bg-[#D1FAE5] text-emerald-800 border-emerald-200' },
    { grade: 'A+', point: 9, range: '81–90%', bg: 'bg-[#E0E7FF] text-[#4F46E5] border-indigo-200' },
    { grade: 'A', point: 8, range: '71–80%', bg: 'bg-[#DBEAFE] text-blue-800 border-blue-200' },
    { grade: 'B+', point: 7, range: '61–70%', bg: 'bg-[#FEF3C7] text-amber-800 border-amber-200' },
    { grade: 'B', point: 6, range: '56–60%', bg: 'bg-orange-100 text-orange-800 border-orange-200' },
    { grade: 'C', point: 5, range: '50–55%', bg: 'bg-slate-100 text-slate-800 border-slate-200' },
    { grade: 'U', point: 0, range: '< 50% (Reappear)', bg: 'bg-[#FEE2E2] text-rose-800 border-rose-200' },
  ]);

  // Load profile-specific dataset or default SKCET IT preset
  const profileStorageKey = user ? `cgpa_app_semesters_${user.studentId || user.id}` : 'cgpa_app_semesters';

  const [semesters, setSemesters] = useState(() => {
    let raw = CURRICULUM_PRESETS.skcet_it_24_28.semesters;
    const saved = localStorage.getItem(profileStorageKey);
    if (saved) {
      try { raw = JSON.parse(saved); } catch (e) { }
    }
    return raw.map(sem => ({
      ...sem,
      courses: (sem.courses || []).filter(c => c.code !== '23MC102' && !c.name.includes('Environmental Sciences'))
    }));
  });

  // Reload semesters when switching users
  useEffect(() => {
    if (user) {
      const key = `cgpa_app_semesters_${user.studentId || user.id}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setSemesters(parsed.map(sem => ({
            ...sem,
            courses: (sem.courses || []).filter(c => c.code !== '23MC102' && !c.name.includes('Environmental Sciences'))
          })));
          return;
        } catch (e) { }
      }
    }
    // Fallback to default preset
    setSemesters(CURRICULUM_PRESETS.skcet_it_24_28.semesters.map(sem => ({
      ...sem,
      courses: (sem.courses || []).filter(c => c.code !== '23MC102' && !c.name.includes('Environmental Sciences'))
    })));
  }, [user]);

  // Save changes to profile-specific localStorage
  useEffect(() => {
    if (user) {
      const key = `cgpa_app_semesters_${user.studentId || user.id}`;
      localStorage.setItem(key, JSON.stringify(semesters));
    } else {
      localStorage.setItem('cgpa_app_semesters', JSON.stringify(semesters));
    }
  }, [semesters, user]);

  // Map grade scale points lookup
  const gradePointsMap = useMemo(() => {
    const map = {};
    gradeScaleRules.forEach(rule => {
      map[rule.grade] = Number(rule.point);
    });
    return { ...GRADE_POINTS_DEFAULT, ...map };
  }, [gradeScaleRules]);

  // Active semester
  const activeSemester = useMemo(() => {
    return semesters.find(s => s.id === currentSemesterId) || semesters[0] || { courses: [], included: true };
  }, [semesters, currentSemesterId]);

  // Active semester SGPA & totals calculation
  const semesterCalculations = useMemo(() => {
    let earnedPoints = 0;
    let earnedCredits = 0;
    let gradedCoursesCount = 0;

    (activeSemester.courses || []).forEach(c => {
      if (c.grade && gradePointsMap.hasOwnProperty(c.grade)) {
        const pts = gradePointsMap[c.grade];
        earnedPoints += c.credits * pts;
        earnedCredits += c.credits;
        gradedCoursesCount++;
      }
    });

    const sgpa = earnedCredits > 0 ? (earnedPoints / earnedCredits) : 0;
    return {
      sgpa,
      totalCredits: earnedCredits,
      totalGradePoints: earnedPoints,
      gradedCoursesCount
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

  const handleDeleteCourse = (courseIndex) => {
    setSemesters(prev => prev.map(s => {
      if (s.id === currentSemesterId) {
        const newCourses = (s.courses || []).filter((_, idx) => idx !== courseIndex);
        return { ...s, courses: newCourses };
      }
      return s;
    }));
  };

  const handleToggleSemesterInclude = (semId) => {
    setSemesters(prev => prev.map(s => {
      if (s.id === semId) {
        return { ...s, included: s.included === false ? true : false };
      }
      return s;
    }));
  };

  // Render Standalone Dedicated Login Screen when Logged Out
  if (!isLoggedIn) {
    return (
      <LoginModal 
        savedProfiles={savedProfiles}
        onLogin={handleLogin}
        onSelectProfile={handleLogin}
        onDeleteProfile={handleDeleteProfile}
      />
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#EEEEFF] text-slate-800 flex flex-col md:flex-row antialiased relative">
      {/* Section 2: Left Sidebar (Fixed 260px) */}
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onLogout={handleLogout}
      />

      {/* Main Container Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Section 1: Top Navbar (Fixed, Non-scrollable) */}
        <Navbar 
          currentSemesterId={currentSemesterId}
          setCurrentSemesterId={setCurrentSemesterId}
          semesters={semesters}
          setMobileOpen={setMobileOpen}
          userName={user?.name || 'Student'}
        />

        {/* Dynamic Main Body (Center & Right Columns) */}
        <div className="flex-1 flex flex-col xl:flex-row min-h-0 overflow-hidden">
          {activeTab === 'dashboard' && (
            <>
              {/* Section 3: Center Column (Subjects & Grade Scale - Scrollable) */}
              <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6">
                <SubjectTable 
                  courses={activeSemester.courses || []}
                  gradeOptions={Object.keys(gradePointsMap)}
                  gradePoints={gradePointsMap}
                  included={activeSemester.included !== false}
                  onToggleInclude={() => handleToggleSemesterInclude(currentSemesterId)}
                  onUpdateCourse={handleUpdateCourse}
                  onDeleteCourse={handleDeleteCourse}
                />

                <GradeScale 
                  gradeScale={gradeScaleRules}
                  onSaveGradeScale={(newRules) => setGradeScaleRules(newRules)}
                />
              </main>

              {/* Section 4: Rightmost Column (Overall CGPA & Metrics - Non-scrollable) */}
              <RightPanel 
                cgpa={overallCgpaCalculations.cgpa}
                sgpa={semesterCalculations.sgpa}
                totalCredits={overallCgpaCalculations.totalCumCredits || semesterCalculations.totalCredits}
                totalGradePoints={overallCgpaCalculations.totalCumPoints || semesterCalculations.totalGradePoints}
                courses={activeSemester.courses || []}
                activeSemesterName={activeSemester.name}
              />
            </>
          )}

          {/* Sub-view: Dedicated CGPA Trends & Performance Analytics Page */}
          {activeTab === 'cgpa-trends' && (
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
              <CGPATrendsPage 
                semesters={semesters}
                gradePointsMap={gradePointsMap}
              />
            </main>
          )}

          {/* Sub-view: Settings Page */}
          {activeTab === 'settings' && (
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
              <SettingsPage 
                user={user}
                onUpdateUser={handleUpdateUser}
                onResetGrades={handleResetGrades}
                onExportData={handleExportData}
                onDeleteProfile={handleDeleteProfile}
              />
            </main>
          )}

          {/* Sub-view: Dedicated Help & Support Guide Page */}
          {activeTab === 'help' && (
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
              <HelpPage onReturnToDashboard={() => setActiveTab('dashboard')} />
            </main>
          )}
        </div>
      </div>
    </div>
  );
}
