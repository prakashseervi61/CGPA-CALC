import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PieChart as PieIcon, Award } from 'lucide-react';
import Card from '../ui/Card';
import { useData } from '../../contexts/DataContext';

const GRADE_COLOR_MAP = {
  'O': '#7A9E7E',   // Muted green
  'A+': '#6366F1',  // Indigo (primary)
  'A': '#D4A843',   // Warm amber
  'B+': '#E0976E',  // Light terracotta
  'B': '#A8A29E',   // Stone
  'C': '#78716C',   // Stone dark
  'U': '#C75B5B',   // Muted danger
};

export default function GradeDistribution() {
  const { activeSemester } = useData();
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
        color: GRADE_COLOR_MAP[g] || '#7C3AED'
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
      chartData: data,
      totalGrades,
      mostFrequent: totalGrades > 0 ? mostFrequent : 'None'
    };
  }, [courses]);

  const hasGrades = distributionData.totalGrades > 0;

  return (
    <Card className="shadow-sm border border-stone-200 dark:border-stone-800 p-5 shrink min-h-0 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary-light text-primary flex items-center justify-center shrink-0">
            <PieIcon className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-stone-900 dark:text-stone-100">Grade Distribution</h4>
            <p className="text-xs text-stone-500 font-semibold">Breakdown of achieved grades</p>
          </div>
        </div>
      </div>

      {!hasGrades ? (
        <div className="py-8 text-center">
          <p className="text-xs text-stone-500 font-semibold">No grades entered yet</p>
        </div>
      ) : (
        <>
          {/* 2-Column Tight Layout: Left (45%) Donut Chart, Right (55%) Legend */}
          <div className="flex items-center justify-between gap-2 my-2 shrink">
            {/* Left Column: Donut Chart (45% width) */}
            <div className="w-[45%] h-28 flex items-center justify-center relative shrink">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#292524',
                      borderRadius: '12px',
                      color: '#F5F5F4',
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
                <span className="text-base font-black text-stone-900 dark:text-stone-100 leading-tight">
                  {distributionData.totalGrades}
                </span>
                <span className="text-[9px] uppercase font-extrabold text-stone-500">
                  Grades
                </span>
              </div>
            </div>

            {/* Right Column: Tightly Aligned Grade List (55% width) */}
            <div className="w-[55%] space-y-2 pl-1">
              {distributionData.chartData.map((item) => (
                <div key={item.gradeKey} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-extrabold text-stone-800 dark:text-stone-200">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span>Grade {item.gradeKey}</span>
                    </div>
                    <span className="text-[11px] text-stone-500 dark:text-stone-400 font-extrabold">{item.percentage}%</span>
                  </div>
                  {/* Compact Progress Bar */}
                  <div className="w-full bg-stone-100 dark:bg-stone-800 h-1 rounded-full overflow-hidden">
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
          <div className="mt-2 pt-2 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between bg-primary-light/50 px-3 py-1.5 rounded-xl shrink">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" />
              <span className="text-xs font-extrabold text-stone-800 dark:text-stone-200">
                Most Frequent Grade:
              </span>
            </div>
            <span className="text-xs font-black text-primary bg-primary-light px-2.5 py-0.5 rounded-lg border border-primary/20">
              Grade {distributionData.mostFrequent}
            </span>
          </div>
        </>
      )}
    </Card>
  );
}