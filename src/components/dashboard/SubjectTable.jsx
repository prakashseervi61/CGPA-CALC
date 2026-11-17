import { useState } from 'react';
import { Info, XCircle, RotateCcw, ChevronDown, AlertTriangle, Check, Plus } from 'lucide-react';
import Badge from '../ui/Badge';
import { useData } from '../../contexts/DataContext';

const RING_COLORS = [
  'bg-primary-light text-primary-hover',
  'bg-success-light text-success border-success-border',
  'bg-amber-100 text-amber-800',
  'bg-primary-light text-primary',
  'bg-danger-light text-danger',
];

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
    handleToggleSemesterInclusion
  } = useData();

  const courses = activeSemester?.courses || [];
  const gradeOptions = Object.keys(gradePointsMap);
  const included = activeSemester?.included !== false;

  return (
    <div className="space-y-4">
      {/* Semester Selector + Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="relative inline-block">
          <label htmlFor="semester-select" className="text-[10px] font-black uppercase text-stone-500 dark:text-stone-400 tracking-wider mr-1.5">Sem</label>
          <select
            id="semester-select"
            aria-label="Select semester"
            value={currentSemesterId}
            onChange={(e) => handleSetCurrentSemester(Number(e.target.value))}
            className="appearance-none bg-primary-light dark:bg-primary-hover/20 border border-primary-light dark:border-primary-hover/40 rounded-xl px-3 py-1.5 pr-7 text-xs font-black text-primary dark:text-primary-light hover:bg-primary-light/60 dark:hover:bg-primary-hover/30 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200 cursor-pointer"
          >
            {semesters.map(sem => (
              <option key={sem.id} value={sem.id}>
                {sem.name}{sem.courses?.length ? ` (${sem.courses.length})` : ''}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3 h-3 text-primary dark:text-primary-light pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleSemesterInclusion}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-extrabold border transition-all duration-200 cursor-pointer
              ${included
                ? 'bg-[#D4E8D6] dark:bg-[#4A6E4D]/20 text-[#2D5A30] dark:text-[#9AB89E] border-[#B8D4BB] dark:border-[#4A6E4D]/40 hover:bg-[#C2DBC5] dark:hover:bg-[#4A6E4D]/30'
                : 'bg-stone-100 dark:bg-stone-700 text-stone-500 dark:text-stone-400 border-stone-200 dark:border-stone-600 hover:bg-stone-200 dark:hover:bg-stone-600'
              }`}
            title={included ? 'Exclude this semester from CGPA' : 'Include this semester in CGPA'}
          >
            {included ? <Check className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
            {included ? 'Included' : 'Excluded'}
          </button>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all"
            title="Reset all grades in this semester"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handleAddSubject}
            className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-600 bg-stone-50 dark:bg-stone-800 text-xs font-extrabold text-stone-700 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-700 hover:border-primary/50 transition-all duration-200"
            title="Add a new subject"
          >
            <Plus className="w-3 h-3 shrink-0" />
            <span className="ml-1">Add Subject</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs" onClick={() => setShowResetConfirm(false)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-slate-700 max-w-xs w-full mx-4 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/30 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">Reset Grades?</h4>
                <p className="text-xs text-slate-500 dark:text-stone-400 font-semibold">This will clear all grades for {activeSemester?.name}.</p>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => { handleResetGrades('current'); setShowResetConfirm(false); }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 transition-all"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Excluded Semester Alert Banner if Excluded */}
      {!included && (
        <div className="mb-4 px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center gap-2">
          <XCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>This semester is currently excluded from your overall CGPA calculation. Toggle the button above to include it.</span>
        </div>
      )}

      {/* Linear Subject List */}
      <div className="space-y-2">
        {courses.length === 0 ? (
          <div className="py-8 text-center text-slate-400 dark:text-stone-500 font-medium text-sm">
            No subjects listed for this semester.
          </div>
        ) : (
          courses.map((course, idx) => {
            const key = idx;
            const hasGrade = !!course.grade;
            const point = hasGrade ? (gradePointsMap[course.grade] ?? 0) : 0;

            return (
              <div
                key={key}
                className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 hover:border-primary/30 transition-colors duration-150 group"
              >
                {/* Number + Subject Name */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-black shrink-0 ${RING_COLORS[idx % RING_COLORS.length]}`}>
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <span className="font-black text-slate-900 dark:text-stone-50 text-sm tracking-tight leading-snug block">
                      {course.name}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-stone-400 mt-0.5">
                      {course.credits} {course.credits === 1 ? 'credit' : 'credits'}
                    </span>
                  </div>
                </div>

                {/* Grade Selector */}
                <div className="flex items-center gap-2 min-w-0">
                  <select
                    value={course.grade || ''}
                    onChange={(e) => handleUpdateCourse(idx, { ...course, grade: e.target.value })}
                    aria-label={`Grade for ${course.name}`}
                    className={`w-[110px] px-3 py-1.5 pr-8 rounded-xl font-black text-sm border transition-all cursor-pointer focus:outline-none appearance-none bg-white dark:bg-stone-800
                      ${course.grade
                        ? 'bg-primary-light text-primary-hover border-primary-light/60 dark:bg-primary-hover/20 dark:text-primary-light dark:border-primary-hover/40'
                        : 'border-stone-200 dark:border-stone-600 text-slate-700 dark:text-stone-300'
                      }`}
                  >
                    <option value="" className="bg-white text-slate-400">Select</option>
                    {gradeOptions.map((g) => (
                      <option key={g} value={g} className="bg-white text-slate-800 font-extrabold">Grade {g}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-3 h-3 text-slate-400 pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" />
                </div>

                {/* Points */}
                <Badge
                  variant={hasGrade && point > 0 ? 'green' : hasGrade && point === 0 ? 'danger' : 'slate'}
                  size="md"
                  className="whitespace-nowrap"
                >
                  {hasGrade ? `${point.toFixed(1)} Pts` : '--'}
                </Badge>

                {/* Remove Subject */}
                <button
                  onClick={() => handleRemoveSubject(idx)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all"
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
        <div className="mt-4 p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/80 flex items-start gap-2.5">
          <Info className="w-4.5 h-4.5 text-blue-700 shrink-0 mt-0.5" />
          <div className="text-xs text-blue-950 leading-relaxed font-semibold flex-1">
            <span className="font-extrabold text-blue-900">Formula Tip:</span> SGPA is calculated as <code className="bg-blue-100 px-1.5 py-0.5 rounded text-[11px] font-mono font-bold text-blue-900">Σ(Credits × Grade Points) / Σ(Credits)</code>. Select grades for all subjects to calculate SGPA & CGPA dynamically.
          </div>
          <button onClick={() => { setTipDismissed(true); try { localStorage.setItem('cgpa_tip_dismissed', '1'); } catch {} }} className="text-blue-400 hover:text-blue-600 shrink-0" aria-label="Dismiss formula tip">
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
