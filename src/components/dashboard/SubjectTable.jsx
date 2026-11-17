import { useState } from 'react';
import { Info, XCircle, RotateCcw, ChevronDown, AlertTriangle, Check, Plus } from 'lucide-react';
import Badge from '../ui/Badge';
import { useData } from '../../contexts/DataContext';

const RING_COLORS = [
  'bg-primary-light text-primary-hover border-primary-border',
  'bg-success-light text-success-text border-success-border',
  'bg-warning-light text-warning border-warning-border',
  'bg-primary-light text-primary-hover border-primary-border',
  'bg-danger-light text-danger-text border-danger-border',
];

const CREDIT_OPTIONS = [1, 2, 3, 4, 5, 6];

const gradeSelectClassName = (hasGrade) =>
  `w-full px-3 py-2 pr-9 rounded-xl border transition-all font-extrabold text-sm appearance-none cursor-pointer focus:outline-none ${hasGrade ? 'bg-success-light text-success-text border-success-border shadow-xs dark:bg-success-light/20 dark:text-success-text dark:border-success-border' : 'border-border dark:border-border-strong bg-stone-50 dark:bg-stone-800 text-text-secondary hover:border-stone-300 dark:hover:border-stone-600'}`;

export default function SubjectTable() {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [tipDismissed, setTipDismissed] = useState(() => {
    try { return localStorage.getItem('cgpa_tip_dismissed') === '1'; } catch { return false; }
  });
  const {
    activeSemester,
    currentSemesterId,
    handleSetCurrentSemester,
    semesters,
    handleUpdateCourse,
    gradePointsMap,
    handleResetGrades,
    handleAddSubject,
    handleRemoveSubject,
    handleToggleSemesterInclusion,
  } = useData();

  const courses = activeSemester?.courses || [];
  const gradeOptions = Object.keys(gradePointsMap);
  const included = activeSemester?.included !== false;

  const handleGradeChange = (idx, grade) => {
    handleUpdateCourse(idx, { ...courses[idx], grade });
  };

  const handleCreditsChange = (idx, credits) => {
    handleUpdateCourse(idx, { ...courses[idx], credits });
  };

  return (
    <div className="space-y-4">
      {/* Semester Selector + Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="relative inline-block">
          <label htmlFor="semester-select" className="text-[10px] font-black uppercase text-text-secondary tracking-wider mr-1.5">
            Sem
          </label>
          <select
            id="semester-select"
            aria-label="Select semester"
            value={currentSemesterId}
            onChange={(e) => handleSetCurrentSemester(Number(e.target.value))}
            className="appearance-none bg-primary-light dark:bg-primary-hover/20 border border-primary-light dark:border-primary-hover/40 rounded-xl px-3 py-1.5 pr-9 text-xs font-black text-primary dark:text-primary-light hover:bg-primary-light/60 dark:hover:bg-primary-hover/30 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200 cursor-pointer"
          >
            {semesters.map((sem) => (
              <option key={sem.id} value={sem.id}>
                {sem.name} ({sem.courses.length})
              </option>
            ))}
          </select>
          <ChevronDown className="w-3 h-3 text-primary dark:text-primary-light pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleSemesterInclusion}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-extrabold border transition-all duration-200 cursor-pointer
              ${included
                ? 'bg-success-light text-success-text border-success-border shadow-sm dark:bg-success-light/20 hover:bg-success-light dark:hover:bg-success-light/30'
                : 'bg-surface-variant dark:bg-stone-800 text-text-secondary border-border dark:border-border-strong hover:bg-stone-100 dark:hover:bg-stone-800/50'
              }`}
            title={included ? 'Exclude this semester from CGPA' : 'Include this semester in CGPA'}
          >
            {included ? <Check className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
            {included ? 'Included' : 'Excluded'}
          </button>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="p-2.5 rounded-lg text-text-tertiary hover:text-danger hover:bg-danger-light/50 dark:hover:bg-danger/10 transition-all duration-200"
            title="Reset all grades in this semester"
            aria-label="Reset grades"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handleAddSubject}
            className="px-3 py-1.5 rounded-lg border border-border dark:border-border-strong bg-surface dark:bg-surface-variant text-xs font-extrabold text-text-secondary hover:bg-primary-light dark:hover:bg-primary-hover/20 hover:border-primary/50 transition-all duration-200"
            title="Add a new subject"
            aria-label="Add subject"
          >
            <Plus className="w-3 h-3 shrink-0" />
            <span className="ml-1">Add Subject</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowResetConfirm(false)}>
          <div className="bg-surface dark:bg-surface-variant rounded-2xl p-6 shadow-xl border border-border dark:border-border-strong max-w-xs w-full mx-4 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-danger-light text-danger-text flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-text-primary">Reset Grades?</h4>
                <p className="text-xs text-text-tertiary font-semibold">
                  This will clear all grades for {activeSemester?.name}.
                </p>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-lg text-xs font-extrabold text-text-secondary bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => { handleResetGrades('current'); setShowResetConfirm(false); }}
                className="px-4 py-2 rounded-lg text-xs font-extrabold text-white bg-danger hover:bg-danger transition-all"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Excluded Semester Alert Banner */}
      {!included && (
        <div className="mb-4 px-3.5 py-2.5 rounded-xl bg-warning-light border border-warning-border text-warning font-extrabold text-xs flex items-center gap-2">
          <XCircle className="w-4 h-4" />
          <span>This semester is excluded from CGPA. Toggle above to include it.</span>
        </div>
      )}

      {/* Linear Subject List */}
      <div className="space-y-2">
        {courses.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center mx-auto mb-3 text-text-tertiary">
              <Plus className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-sm text-text-primary mb-1">No subjects yet</h4>
            <p className="text-xs text-text-tertiary">Click "Add Subject" to start tracking your grades.</p>
          </div>
        ) : (
          courses.map((course, idx) => {
            const hasGrade = !!course.grade;
            const point = hasGrade ? (gradePointsMap[course.grade] ?? 0) : 0;

            return (
              <div
                key={idx}
                className="flex items-center justify-between gap-3 px-3.5 py-3 rounded-xl border border-border dark:border-border-strong bg-surface dark:bg-surface-variant hover:border-primary/40 transition-colors duration-150 group focus-within:ring-2 focus-within:ring-primary/20"
              >
                {/* Number + Subject Name */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-[10px] font-black shrink-0 ${RING_COLORS[idx % RING_COLORS.length]}`}>
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <span className="font-extrabold text-text-primary text-sm tracking-tight leading-snug block">
                      {course.name}
                    </span>
                  </div>
                </div>

                {/* Credits Selector */}
                <div className="flex items-center gap-2 min-w-[90px]">
                  <label className="text-[10px] font-extrabold text-text-tertiary hidden sm:block">Credits</label>
                  <select
                    value={course.credits}
                    onChange={(e) => handleCreditsChange(idx, Number(e.target.value))}
                    className="w-[64px] px-2 py-1.5 rounded-lg border border-border dark:border-border-strong text-[11px] font-extrabold text-center bg-stone-50 dark:bg-stone-800 focus:border-primary focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
                  >
                    {CREDIT_OPTIONS.map((cr) => (
                      <option key={cr} value={cr}>{cr}</option>
                    ))}
                  </select>
                  <Badge variant="outline" size="sm">{course.credits}</Badge>
                </div>

                {/* Grade Selector */}
                <div className="relative flex-1 max-w-[120px]">
                  <select
                    value={course.grade || ''}
                    onChange={(e) => handleGradeChange(idx, e.target.value)}
                    className={gradeSelectClassName(hasGrade)}
                  >
                    <option value="" className="text-text-tertiary">Grade</option>
                    {gradeOptions.map((g) => (
                      <option key={g} value={g} className="bg-surface dark:bg-surface-variant text-text-primary font-extrabold">
                        Grade {g}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3 h-3 text-text-tertiary pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
                </div>

                {/* Points */}
                <Badge
                  variant={hasGrade && point > 0 ? 'success' : hasGrade && point === 0 ? 'danger' : 'slate'}
                  size="md"
                  className="whitespace-nowrap"
                >
                  {hasGrade ? `${point.toFixed(1)} Pts` : '--'}
                </Badge>

                {/* Remove Subject */}
                <button
                  onClick={() => handleRemoveSubject(idx)}
                  className="p-1.5 rounded-lg text-text-tertiary hover:text-danger hover:bg-danger-light/50 dark:hover:bg-danger/10 transition-all duration-200"
                  title="Remove subject"
                  aria-label={`Remove ${course.name}`}
                >
                  <XCircle className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Information Alert Box */}
      {!tipDismissed && (
        <div className="mt-4 p-3.5 rounded-xl bg-blue-50 border border-blue-200/80 flex items-start gap-2.5">
          <Info className="w-4.5 h-4.5 text-blue-700 shrink-0 mt-0.5" />
          <div className="text-xs text-blue-900 leading-relaxed font-extrabold flex-1">
            <span className="font-extrabold text-blue-900">Formula Tip:</span> SGPA is calculated as{' '}
            <code className="bg-blue-100 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold text-blue-900">
              Σ(Credits × Grade Points) / Σ(Credits)
            </code>{' '}
            . Select grades for all subjects to calculate SGPA & CGPA dynamically.
          </div>
          <button
            onClick={() => { setTipDismissed(true); try { localStorage.setItem('cgpa_tip_dismissed', '1'); } catch {} }}
            className="text-blue-400 hover:text-blue-600 shrink-0"
            aria-label="Dismiss formula tip"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
