import { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { CURRICULUM_PRESETS } from '../data/curriculum';
import AuthContext from './AuthContext';

const skipCourse = c => c.code !== '23MC102' && !c.name.includes('Environmental Sciences');

function loadSemesters(userId) {
  const key = userId ? `cgpa_app_semesters_${userId}` : 'cgpa_app_semesters';
  const saved = localStorage.getItem(key);
  if (saved) {
    try {
      return JSON.parse(saved).map(sem => ({ ...sem, courses: (sem.courses || []).filter(skipCourse) }));
    } catch (e) { /* fall through */ }
  }
  return CURRICULUM_PRESETS.skcet_it_24_28.semesters.map(sem => ({
    ...sem, courses: (sem.courses || []).filter(skipCourse)
  }));
}

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  const [semesters, setSemesters] = useState(() => loadSemesters(user ? user.studentId || user.id : null));

  const [currentSemesterId, setCurrentSemesterId] = useState(1);

  const [gradeScaleRules, setGradeScaleRules] = useState([
    { grade: 'O', point: 10, range: '91–100%', bg: 'bg-[#D4E8D6] text-[#4A6E4D] border-[#B8D4BB]' },
    { grade: 'A+', point: 9, range: '81–90%', bg: 'bg-[#F5E6D3] text-[#8B4F32] border-[#EBD5BE]' },
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

  // Persist semesters to localStorage whenever they change (per user)
  useEffect(() => {
    const key = user ? `cgpa_app_semesters_${user.studentId || user.id}` : 'cgpa_app_semesters';
    localStorage.setItem(key, JSON.stringify(semesters));
  }, [semesters, user]);

  // When user changes, reset to first semester and reload semesters
  useEffect(() => {
    setCurrentSemesterId(1);
    if (user) {
      setSemesters(loadSemesters(user.studentId || user.id));
    } else {
      setSemesters(loadSemesters(null));
    }
  }, [user]);

  const value = useMemo(() => ({
    user,
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
    handleToggleSemesterInclusion
  }), [user, semesters, currentSemesterId, gradeScaleRules, gradePointsMap, activeSemester, semesterCalculations, overallCgpaCalculations]);

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
