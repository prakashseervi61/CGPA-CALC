import { useMemo } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';
import { TrendingUp, Award, Zap, BookOpen, Layers, XCircle, Target, Check } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { useData } from '../../contexts/DataContext';
import { useUser } from '../../contexts/AuthContext';

export default function CGPATrendsPage() {
  const { semesters, gradePointsMap, currentSemesterId } = useData();
  const { user } = useUser();
  const targetCgpa = user?.targetCgpa || 9.00;

  // Compute analytics and chart datasets across all semesters
  const analyticsData = useMemo(() => {
    let cumPoints = 0;
    let cumCredits = 0;
    let highestSgpa = 0;
    let highestSemName = 'None';
    let totalCompletedSemesters = 0;
    let totalRemainingCredits = 0;

    const chartData = semesters.map((sem, idx) => {
      let semPoints = 0;
      let semCredits = 0;
      let gradedCount = 0;

      (sem.courses || []).forEach(c => {
        if (c.grade && gradePointsMap.hasOwnProperty(c.grade)) {
          const pts = gradePointsMap[c.grade];
          semPoints += c.credits * pts;
          semCredits += c.credits;
          gradedCount++;

          if (sem.included !== false) {
            cumPoints += c.credits * pts;
            cumCredits += c.credits;
          }
        } else if (sem.included !== false) {
          // Count credits for future semesters (no grade yet)
          if (idx >= semesters.findIndex(s => s.id === currentSemesterId)) {
            // This is a future semester or current but ungraded - count towards remaining
            totalRemainingCredits += c.credits;
          }
        }
      });

      const sgpaVal = semCredits > 0 ? (semPoints / semCredits) : 0;
      const cgpaVal = cumCredits > 0 ? (cumPoints / cumCredits) : 0;

      if (sgpaVal > 0) totalCompletedSemesters++;
      if (sgpaVal > highestSgpa) {
        highestSgpa = sgpaVal;
        highestSemName = sem.name;
      }

      return {
        id: sem.id,
        name: `Sem ${sem.id}`,
        fullName: sem.name,
        sgpa: Number(sgpaVal.toFixed(2)),
        cgpa: Number(cgpaVal.toFixed(2)),
        credits: semCredits,
        points: semPoints,
        gradedCount,
        included: sem.included !== false
      };
    });

    const overallCgpa = cumCredits > 0 ? (cumPoints / cumCredits) : 0;

    // Calculate required future GPA to reach target
    let requiredFutureGpa = 0;
    const targetTotalPoints = targetCgpa * (cumCredits + totalRemainingCredits);
    const requiredRemainingPoints = targetTotalPoints - cumPoints;

    if (totalRemainingCredits > 0) {
      requiredFutureGpa = requiredRemainingPoints / totalRemainingCredits;
      requiredFutureGpa = Math.max(0, Math.min(requiredFutureGpa, 10.0));
    } else {
      // No remaining credits
      requiredFutureGpa = overallCgpa >= targetCgpa ? 0 : 10.0; // 0 if achieved, 10 if not possible
    }

    return {
      chartData,
      overallCgpa: Number(overallCgpa.toFixed(2)),
      totalCumCredits: cumCredits,
      totalCumPoints: cumPoints,
      highestSgpa: Number(highestSgpa.toFixed(2)),
      highestSemName,
      totalCompletedSemesters,
      totalRemainingCredits,
      requiredFutureGpa: Number(requiredFutureGpa.toFixed(2)),
      targetCgpa: Number(targetCgpa.toFixed(2))
    };
  }, [semesters, gradePointsMap, user?.targetCgpa, currentSemesterId]);

  return (
    <div className="space-y-6 select-none">
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-200 dark:border-stone-700">
        <div>
          <h2 className="text-2xl font-black text-stone-900 dark:text-stone-100 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary-light text-primary flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            Academic Performance & Trends
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 font-semibold mt-1">
            Semester-by-semester SGPA progression curve, credit distribution & cumulative analytics
          </p>
        </div>
      </div>

      {/* 6 KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4">
        {[
          { label: 'Overall CGPA', value: analyticsData.overallCgpa.toFixed(2), sub: 'out of 10.0 Cumulative', icon: Award, gradient: true },
          { label: 'Target CGPA', value: analyticsData.targetCgpa.toFixed(2), sub: 'Goal to Achieve', icon: Target, gradient: true },
          { label: 'Peak Performance', value: analyticsData.highestSgpa > 0 ? analyticsData.highestSgpa.toFixed(2) : '--', sub: `Highest SGPA (${analyticsData.highestSgpa})`, icon: Zap },
          { label: 'Earned Credits', value: analyticsData.totalCumCredits, sub: 'Total Academic Credits', icon: BookOpen },
          { label: 'Semesters', value: `${analyticsData.totalCompletedSemesters} / ${semesters.length}`, sub: 'Completed Semesters', icon: Layers },
          { label: 'Required GPA', value: analyticsData.requiredFutureGpa === 0 ? 'DONE' : analyticsData.requiredFutureGpa >= 10 ? 'N/A' : analyticsData.requiredFutureGpa.toFixed(2), sub: analyticsData.requiredFutureGpa === 0 ? 'Target achieved!' : analyticsData.requiredFutureGpa >= 10 ? 'Cannot reach target' : `Need avg`, icon: analyticsData.requiredFutureGpa === 0 ? Check : analyticsData.requiredFutureGpa >= 10 ? XCircle : Zap }
        ].map((kpi, idx) => (
          <Card key={idx} className={`p-2 sm:p-3 lg:p-4 ${kpi.gradient ? 'bg-gradient-to-br from-primary to-primary-hover text-white shadow-md shadow-primary/15 border-primary/20' : idx === 5 && analyticsData.requiredFutureGpa === 0 ? 'bg-success/20 border-success/30' : idx === 5 && analyticsData.requiredFutureGpa >= 10 ? 'bg-danger/20 border-danger/30' : idx === 5 ? 'bg-primary/20 border-primary/30' : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 shadow-sm'} relative overflow-hidden border`}>
            <div className="flex items-center justify-between mb-1 lg:mb-2">
              <span className={`text-[9px] sm:text-[10px] lg:text-xs font-black uppercase tracking-wider truncate ${kpi.gradient ? 'text-primary-light' : 'text-stone-500'}`}>{kpi.label}</span>
              <kpi.icon className="w-3 h-3 lg:w-4 lg:h-4 text-warning shrink-0" />
            </div>
            <div className={`text-lg sm:text-2xl lg:text-3xl font-black ${kpi.gradient ? 'text-white' : 'text-stone-900 dark:text-stone-100'}`}>{kpi.value}</div>
            <p className={`text-[8px] sm:text-[9px] lg:text-[11px] font-semibold mt-0.5 lg:mt-1 truncate ${kpi.gradient ? 'text-primary-light/80' : 'text-stone-500 dark:text-stone-400'}`}>{kpi.sub}</p>
          </Card>
        ))}
      </div>

      {/* Main Chart 1: Dual Series Progression Curve (SGPA vs CGPA) */}
      <Card className="p-6 border border-stone-200 dark:border-stone-800 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-200 dark:border-stone-800">
          <div>
            <h3 className="text-base font-extrabold text-stone-900 dark:text-stone-50">SGPA vs CGPA Progression Curve</h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-semibold">Comparison of individual semester SGPA against overall cumulative CGPA</p>
          </div>
        </div>

        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analyticsData.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="cgpaGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C27856" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#C27856" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="sgpaGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7A9E7E" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#7A9E7E" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#E7E5E4" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: '#78716C', fontWeight: '800' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 10]}
                tick={{ fontSize: 11, fill: '#78716C', fontWeight: '800' }}
                axisLine={false}
                tickLine={false}
                ticks={[0, 2, 4, 6, 8, 10]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#292524',
                  borderRadius: '12px',
                  color: '#F5F5F4',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  border: 'none',
                  padding: '8px 12px'
                }}
                formatter={(val, name) => [`${val} GPA`, name === 'cgpa' ? 'Cumulative CGPA' : 'Semester SGPA']}
              />
              <Legend
                verticalAlign="top"
                height={36}
                formatter={(val) => val === 'cgpa' ? 'Cumulative CGPA' : 'Semester SGPA'}
              />
              <Area
                type="monotone"
                dataKey="sgpa"
                stroke="#10B981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#sgpaGlow)"
                dot={{ r: 4, fill: '#10B981', strokeWidth: 1.5, stroke: '#fff' }}
                activeDot={{ r: 6 }}
              />
              <Area
                type="monotone"
                dataKey="cgpa"
                stroke="#C27856"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#cgpaGlow)"
                dot={{ r: 4, fill: '#C27856', strokeWidth: 1.5, stroke: '#fff' }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Target Progress Bar */}
      <div className="mt-6">
        <div className="space-y-3">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-stone-700 dark:text-stone-200">Progress Toward Target CGPA</span>
            <span className="text-sm font-medium text-stone-700 dark:text-stone-200">
              {analyticsData.overallCgpa.toFixed(2)} / {analyticsData.targetCgpa.toFixed(2)}
            </span>
          </div>
          <div className="w-full bg-stone-200 dark:bg-stone-700 rounded-full h-2.5">
            <div
              className={`
                h-2.5 rounded-full ${analyticsData.overallCgpa >= analyticsData.targetCgpa ?
                  'bg-success' :
                  analyticsData.overallCgpa >= analyticsData.targetCgpa * 0.8 ?
                  'bg-warning' :
                  'bg-primary'
                } transition-all duration-1000
              `}
              style={{ width: `${Math.min((analyticsData.overallCgpa / analyticsData.targetCgpa) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Chart 2 & Detailed Table Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart: Credits & Points Load */}
        <Card className="p-5 border border-stone-200 dark:border-stone-800 shadow-sm lg:col-span-1">
          <div className="mb-3 pb-2 border-b border-stone-200 dark:border-stone-800">
            <h4 className="text-sm font-extrabold text-stone-900 dark:text-stone-100">Credits Load per Semester</h4>
            <p className="text-xs text-stone-500 font-semibold">Total course credit weight</p>
          </div>
          <div className="w-full h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid stroke="#E7E5E4" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#78716C', fontWeight: '800' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#78716C', fontWeight: '800' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#292524', borderRadius: '10px', color: '#F5F5F4', fontSize: '11px', fontWeight: 'bold', border: 'none' }}
                  formatter={(val) => [`${val} Credits`, 'Credit Load']}
                />
                <Bar dataKey="credits" fill="#C27856" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Detailed Breakdown Table */}
        <Card className="p-5 border border-stone-200 dark:border-stone-800 shadow-sm lg:col-span-2">
          <div className="mb-3 pb-2 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-extrabold text-stone-900 dark:text-stone-100">Semester Performance Breakdown</h4>
              <p className="text-xs text-stone-500 font-semibold">Detailed breakdown for each semester</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-semibold">
              <thead>
                <tr className="text-[11px] font-black uppercase text-stone-500 dark:text-stone-500 border-b border-stone-200 dark:border-stone-700 pb-2">
                  <th className="py-2.5 px-3">Semester</th>
                  <th className="py-2.5 px-3 text-center">Graded</th>
                  <th className="py-2.5 px-3 text-center">Credits</th>
                  <th className="py-2.5 px-3 text-center">SGPA</th>
                  <th className="py-2.5 px-3 text-center">CGPA</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                  <th className="py-2.5 px-3 text-center">Target Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-stone-700">
                {analyticsData.chartData.map((sem) => (
                  <tr key={sem.id} className="hover:bg-slate-50/80 dark:hover:bg-stone-800/50 transition-colors">
                    <td className="py-2.5 px-3 font-extrabold text-slate-900 dark:text-stone-50">{sem.fullName}</td>
                    <td className="py-2.5 px-3 text-center text-slate-600 dark:text-stone-500 font-bold">{sem.gradedCount} subjects</td>
                    <td className="py-2.5 px-3 text-center">
                      <Badge variant="purple" size="sm">{sem.credits} Credits</Badge>
                    </td>
                    <td className="py-2.5 px-3 text-center font-black text-slate-900 dark:text-stone-50">
                      {sem.sgpa > 0 ? sem.sgpa.toFixed(2) : '--'}
                    </td>
                    <td className="py-2.5 px-3 text-center font-black text-[#C27856]">
                      {sem.cgpa > 0 ? sem.cgpa.toFixed(2) : '--'}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <Badge variant={sem.included ? 'green' : 'slate'} size="sm">
                        {sem.included ? 'Included' : 'Excluded'}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-3 text-center text-sm">
                      {/* Show progress toward target for this semester */}
                      {sem.cgpa > 0 ? (
                          sem.cgpa >= analyticsData.targetCgpa ? (
                            <span className="text-xs font-medium text-green-600 dark:text-green-400">✓ Target Met</span>
                          ) : (
                            <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400">
                              {(sem.cgpa / analyticsData.targetCgpa * 100).toFixed(0)}% of target
                            </span>
                          )
                      ) : (
                        <span className="text-xs font-medium text-slate-500 dark:text-stone-500">Not graded</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}