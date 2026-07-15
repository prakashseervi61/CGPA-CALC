import { BookOpen, Info, XCircle } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { useSesame } from '../../hooks/useSesame';

const RING_COLORS = [
  'bg-indigo-100 text-indigo-800',
  'bg-emerald-100 text-emerald-800',
  'bg-amber-100 text-amber-800',
  'bg-blue-100 text-blue-800',
  'bg-rose-100 text-rose-800',
];

export default function SubjectTable() {
  const {
    activeSemester,
    handleUpdateCourse,
    gradePointsMap
  } = useSesame();

  const courses = activeSemester?.courses || [];
  const gradeOptions = Object.keys(gradePointsMap);
  const included = activeSemester?.included !== false;

  return (
    <div className="space-y-4">
      {/* Excluded Semester Alert Banner if Excluded */}
      {!included && (
        <div className="mb-4 px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center gap-2">
          <XCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>This semester is currently excluded from your overall CGPA calculation. Toggle the button above to include it.</span>
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-x-auto -mx-2">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
              <th className="py-3 px-2 text-center whitespace-nowrap">#</th>
              <th className="py-3 px-2">Subject Name</th>
              <th className="py-3 px-2 text-center whitespace-nowrap">Credits</th>
              <th className="py-3 px-2 text-center whitespace-nowrap">Grade</th>
              <th className="py-3 px-2 text-center whitespace-nowrap">Grade Point</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-semibold">
            {courses.length === 0 ? (
              <tr>
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
                    className="hover:bg-slate-50/80 transition-colors duration-150 group"
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
                      <select
                        value={course.grade || ''}
                        onChange={(e) => handleUpdateCourse(idx, { ...course, grade: e.target.value })}
                        className={`
                          px-3.5 py-1.5 rounded-xl font-black text-xs sm:text-sm border transition-all cursor-pointer focus:outline-none
                          ${course.grade
                            ? 'bg-indigo-100 text-indigo-700 border-indigo-200 shadow-xs'
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