import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PieChart as PieIcon, Award } from 'lucide-react';
import Card from '../ui/Card';
import { useSesame } from '../../hooks/useSesame';

const GRADE_COLOR_MAP = {
  'O': '#10B981',   // Emerald / Green
  'A+': '#4F46E5',  // Indigo
  'A': '#3B82F6',   // Blue
  'B+': '#F59E0B',  // Amber
  'B': '#F97316',   // Orange
  'C': '#64748B',   // Slate
  'U': '#EF4444',   // Red
};

export default function GradeDistribution() {
  const { activeSemester } = useSesame();
  const courses = activeSemester?.courses || [];

  // Calculate grade counts & percentages
  const distributionData = useMemo(() => {
    const counts = { 'O': 0, 'A+': 0, 'A': 0, 'B+': 0, 'B': 0, 'C': 0, 'U': 0 };
    let totalGrades = 0;

    courses.forEach(c => {
      if (c.grade && counts.hasOwnProperty(c.grade)) {
        counts[c.grade] += 1;
        totalGrades += 1;
      }
    });

    const data = Object.keys(counts)
      .filter(g => counts[g] > 0)
      .map(g => ({
        name: `Grade ${g}`,
        gradeKey: g,
        value: counts[g],
        percentage: totalGrades > 0 ? Math.round((counts[g] / totalGrades) * 100) : 0,
        color: GRADE_COLOR_MAP[g] || '#4F46E5'
      }));

    // Find most frequent grade
    let mostFrequent = 'None';
    let maxCount = 0;
    Object.entries(counts).forEach(([g, cnt]) => {
      if (cnt > maxCount) {
        maxCount = cnt;
        mostFrequent = g;
      }
    });

    return {
      chartData: data.length > 0 ? data : [
        { name: 'O', gradeKey: 'O', value: 3, percentage: 38, color: GRADE_COLOR_MAP['O'] },
        { name: 'A+', gradeKey: 'A+', value: 3, percentage: 38, color: GRADE_COLOR_MAP['A+'] },
        { name: 'A', gradeKey: 'A', value: 2, percentage: 24, color: GRADE_COLOR_MAP['A'] },
      ],
      totalGrades: totalGrades || 8,
      mostFrequent: totalGrades > 0 ? mostFrequent : 'A+'
    };
  }, [courses]);

  return (
    <Card className="shadow-sm border border-slate-100 p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
            <PieIcon className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-slate-900">Grade Distribution</h4>
            <p className="text-xs text-slate-400 font-semibold">Breakdown of achieved grades</p>
          </div>
        </div>
      </div>

      {/* 2-Column Tight Layout: Left (45%) Donut Chart, Right (55%) Legend */}
      <div className="flex items-center justify-between gap-2 my-2">
        {/* Left Column: Donut Chart (45% width) */}
        <div className="w-[45%] h-36 flex items-center justify-center relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1E293B',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  border: 'none',
                  padding: '6px 10px'
                }}
              />
              <Pie
                data={distributionData.chartData}
                cx="50%"
                cy="50%"
                innerRadius={32}
                outerRadius={50}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {distributionData.chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-base font-black text-slate-900 leading-tight">
              {distributionData.totalGrades}
            </span>
            <span className="text-[9px] uppercase font-extrabold text-slate-400">
              Grades
            </span>
          </div>
        </div>

        {/* Right Column: Tightly Aligned Grade List (55% width) */}
        <div className="w-[55%] space-y-2 pl-1">
          {distributionData.chartData.map((item) => (
            <div key={item.gradeKey} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-extrabold text-slate-800">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span>Grade {item.gradeKey}</span>
                </div>
                <span className="text-[11px] text-slate-500 font-extrabold">{item.percentage}%</span>
              </div>
              {/* Compact Progress Bar */}
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Highlight Badge */}
      <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between bg-indigo-50 px-3 py-2 rounded-xl">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-extrabold text-slate-800">
            Most Frequent Grade:
          </span>
        </div>
        <span className="text-xs font-black text-indigo-600 bg-indigo-100 px-2.5 py-0.5 rounded-lg border border-indigo-200/50">
          Grade {distributionData.mostFrequent}
        </span>
      </div>
    </Card>
  );
}