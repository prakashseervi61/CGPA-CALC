import { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { CURRICULUM_PRESETS } from '../data/curriculum';
import AuthContext from './AuthContext';

const skipCourse = c => c.code !== '23MC102' && !c.name.includes('Environmental Sciences');

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  // Load profile-specific dataset or default SKCET IT preset
  const [semesters, setSemesters] = useState(() => {
    const profileStorageKey = user ? `cgpa_app_semesters_${user.studentId || user.id}` : 'cgpa_app_semesters';
    let raw = CURRICULUM_PRESETS.skcet_it_24_28.semesters;
    const saved = localStorage.getItem(profileStorageKey);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return raw.map(sem => ({
      ...sem,
      courses: (sem.courses || []).filter(skipCourse)
    }));
  });

  const [currentSemesterId, setCurrentSemesterId] = useState(1);

  const [gradeScaleRules, setGradeScaleRules] = useState([
    { grade: 'O', point: 10, range: '91–100%', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    { grade: 'A+', point: 9, range: '81–90%', bg: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
    { grade: 'A', point: 8, range: '71–80%', bg: 'bg-blue-100 text-blue-800 border-blue-200' },
    { grade: 'B+', point: 7, range: '61–70%', bg: 'bg-amber-100 text-amber-800 border-amber-200' },
    { grade: 'B', point: 6, range: '56–60%', bg: 'bg-orange-100 text-orange-800 border-orange-200' },
    { grade: 'C', point: 5, range: '50–55%', bg: 'bg-slate-100 text-slate-800 border-slate-200' },
    { grade: 'U', point: 0, range: '< 50% (Reappear)', bg: 'bg-rose-100 text-rose-800 border-rose-200' }
  ]);

  // Memoize grade points map
  const gradePointsMap = useMemo(() => {
    const map = {};
    gradeScaleRules.forEach(rule => {
      map[rule.grade] = Number(rule.point);
    });
    return map;
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
    return csvContent;
  };

  // Persist semesters to localStorage whenever they change (per user)
  useEffect(() => {
    const key = user ? `cgpa_app_semesters_${user.studentId || user.id}` : 'cgpa_app_semesters';
    localStorage.setItem(key, JSON.stringify(semesters));
  }, [semesters, user]);

  // When user changes, reset to first semester and reload semesters for that user
  useEffect(() => {
    if (user) {
      // Reset to first semester
      setCurrentSemesterId(1);
      // Load semesters for this user (the state initializer already ran, but we need to trigger a refresh if user changed)
      // We'll get the saved semesters for this user and set state
      const profileStorageKey = `cgpa_app_semesters_${user.studentId || user.id}`;
      const saved = localStorage.getItem(profileStorageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setSemesters(
            parsed.map(sem => ({
              ...sem,
              courses: (sem.courses || []).filter(skipCourse)
            }))
          );
        } catch (e) {
          setSemesters(CURRICULUM_PRESETS.skcet_it_24_28.semesters.map(sem => ({
            ...sem,
            courses: (sem.courses || []).filter(skipCourse)
          })));
        }
      } else {
        setSemesters(CURRICULUM_PRESETS.skcet_it_24_28.semesters.map(sem => ({
          ...sem,
          courses: (sem.courses || []).filter(skipCourse)
        })));
      }
    } else {
      setCurrentSemesterId(1);
      setSemesters(CURRICULUM_PRESETS.skcet_it_24_28.semesters.map(sem => ({
        ...sem,
        courses: (sem.courses || []).filter(skipCourse)
      })));
    }
  }, [user]);

  const value = {
    user,
    semesters,
    currentSemesterId,
    setCurrentSemesterId,
    gradeScaleRules,
    setGradeScaleRules,
    gradePointsMap,
    activeSemester,
    semesterCalculations,
    overallCgpaCalculations,
    handleUpdateCourse,
    handleDeleteCourse,
    handleToggleSemesterInclude,
    handleResetGrades,
    handleExportData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;