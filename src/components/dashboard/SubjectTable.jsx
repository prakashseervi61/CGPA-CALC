import { useState } from 'react';
import { Info, XCircle, RotateCcw, ChevronDown, AlertTriangle } from 'lucide-react';
import Badge from '../ui/Badge';
import { useSesame } from '../../contexts/DataContext';

const RING_COLORS = [
  'bg-[#F5E6D3] text-[#8B4F32]',
  'bg-[#D4E8D6] text-[#4A6E4D]',
  'bg-amber-100 text-amber-800',
  'bg-[#F5E6D3] text-[#C27856]',
  'bg-rose-100 text-rose-800',
];

export default function SubjectTable() {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const {
    activeSemester,
    currentSemesterId,
    setCurrentSemesterId,
    semesters,
    handleUpdateCourse,
    gradePointsMap,
    handleResetCurrentSemesterGrades
  } = useSesame();

  const courses = activeSemester?.courses || [];
  const gradeOptions = Object.keys(gradePointsMap);
  const included = activeSemester?.included !== false;

  return (
    <div className="space-y-4">
      {/* Semester Selector + Reset */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 bg-stone-100/70 dark:bg-stone-700/50 border border-stone-200/80 dark:border-stone-600/80 rounded-xl px-3 py-1.5 hover:border-[#C27856]/50 hover:bg-[#F5E6D3]/40 dark:hover:bg-[#C27856]/20 transition-all duration-200">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider leading-none">Sem</span>
          <select
            value={currentSemesterId}
            onChange={(e) => setCurrentSemesterId(Number(e.target.value))}
            className="bg-transparent text-slate-800 dark:text-slate-100 font-extrabold text-xs focus:outline-none cursor-pointer pr-3 appearance-none"
          >
            {semesters.map((sem) => (
              <option key={sem.id} value={sem.id} className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100">
                {sem.name} {sem.courses?.length ? `(${sem.courses.length})` : ''}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3 h-3 text-slate-400 pointer-events-none shrink-0" />
        </div>

        <button
          onClick={() => setShowResetConfirm(true)}
          className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all"
          title="Reset all grades in this semester"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
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
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">This will clear all grades for {activeSemester?.name}.</p>
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
                onClick={() => { handleResetCurrentSemesterGrades(); setShowResetConfirm(false); }}
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

      {/* Table Container */}
      <div className="overflow-x-auto -mx-2">
        <table className="w-full text-left border-collapse min-w-[500px] sm:text-sm text-xs">
          <thead>
            <tr className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
              <th className="py-3 px-2 text-center whitespace-nowrap">#</th>
              <th className="py-3 px-2">Subject Name</th>
              <th className="py-3 px-2 text-center whitespace-nowrap">Credits</th>
              <th className="py-3 px-2 text-center whitespace-nowrap">Grade</th>
              <th className="py-3 px-2 text-center whitespace-nowrap">Grade Point</th>
            </tr>
          </thead>
          <tbody className="font-semibold">
            {courses.length === 0 ? (
              <tr className="border-b border-slate-100 dark:border-slate-700">
                <td colSpan="5" className="py-6 text-center text-slate-400 font-medium">
                  No subjects listed for this semester.
                </td>
              </tr>
            ) : (
              courses.map((course, idx) => {
                const key = course.code || course.id || idx;
                const point = course.grade ? (gradePointsMap[course.grade] ?? 0) : '-';

                return (
                  <tr
                    key={key}
                    className="hover:bg-slate-50/80 border-b border-slate-100 dark:border-slate-700 transition-colors duration-150 group"
                  >
                    {/* Number Badge */}
                    <td className="py-3 px-2 text-center whitespace-nowrap">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-black ${
                        RING_COLORS[idx % RING_COLORS.length]
                      }`}>
                        {idx + 1}
                      </span>
                    </td>

                    {/* Subject Name */}
                    <td className="py-3 px-2 text-slate-800">
                      <div className="flex flex-col">
                        <span className="font-black text-slate-900 text-sm sm:text-base tracking-tight leading-snug">
                          {course.name}
                        </span>
                        {course.code && (
                          <span className="text-[11px] font-bold text-slate-400 leading-tight mt-0.5">
                            {course.code}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Credits */}
                    <td className="py-3 px-2 text-center whitespace-nowrap">
                      <Badge variant="purple" size="md">
                        {course.credits} {course.credits === 1 ? 'Credit' : 'Credits'}
                      </Badge>
                    </td>

                    {/* Grade Selector */}
                    <td className="py-3 px-2 text-center whitespace-nowrap">
                      <div className="relative inline-block">
                        <select
                          value={course.grade || ''}
                          onChange={(e) => handleUpdateCourse(idx, { ...course, grade: e.target.value })}
                          className={`
                            px-3.5 py-2 sm:py-1.5 pr-7 rounded-xl font-black text-xs sm:text-sm border transition-all cursor-pointer focus:outline-none appearance-none
                            ${course.grade
                              ? 'bg-[#F5E6D3] text-[#8B4F32] border-[#EBD5BE] shadow-xs'
                              : 'bg-slate-100 text-slate-700 border-slate-200/80 hover:bg-slate-200/60'
                            }
                          `}
                        >
                          <option value="" className="bg-white text-slate-400">
                            Select
                          </option>
                          {gradeOptions.map((g) => (
                            <option key={g} value={g} className="bg-white text-slate-800 font-extrabold">
                              Grade {g}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
                      </div>
                    </td>

                    {/* Grade Point Badge */}
                    <td className="py-3 px-2 text-center whitespace-nowrap">
                      <Badge
                        variant={point !== '-' && parseFloat(point) > 0 ? 'green' : parseFloat(point) === 0 ? 'red' : 'slate'}
                        size="lg"
                      >
                        {point !== '-' ? `${parseFloat(point).toFixed(1)} Pts` : '--'}
                      </Badge>
                    </td>
                  </tr>
                );
              })
            )}
      </tbody>
        </table>
      </div>

      {/* Information Alert Box */}
      <div className="mt-4 p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/80 flex items-start gap-2.5">
        <Info className="w-4.5 h-4.5 text-blue-700 shrink-0 mt-0.5" />
        <div className="text-xs text-blue-950 leading-relaxed font-semibold">
          <span className="font-extrabold text-blue-900">Formula Tip:</span> SGPA is calculated as <code className="bg-blue-100 px-1.5 py-0.5 rounded text-[11px] font-mono font-bold text-blue-900">Σ(Credits × Grade Points) / Σ(Credits)</code>. Select grades for all subjects to calculate SGPA & CGPA dynamically.
        </div>
      </div>
    </div>
  );
}