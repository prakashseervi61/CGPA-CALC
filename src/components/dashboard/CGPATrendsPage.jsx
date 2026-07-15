import React, { useMemo } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';
import { TrendingUp, Award, Zap, BookOpen, Layers, XCircle, Target } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { useSesame } from '../../hooks/useSesame';
import { useUser } from '../../hooks/useUser';

export default function CGPATrendsPage() {
  const { semesters, gradePointsMap, currentSemesterId } = useSesame();
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
    const currentCompletedCredits = cumCredits;
    const currentEarnedPoints = cumPoints;
    const targetTotalPoints = targetCgpa * (currentCompletedCredits + totalRemainingCredits);
    const requiredRemainingPoints = targetTotalPoints - currentEarnedPoints;

    if (totalRemainingCredits > 0) {
      requiredFutureGpa = requiredRemainingPoints / totalRemainingCredits;
      // Cap at 10.0 (maximum possible GPA)
      requiredFutureGpa = Math.min(requiredFutureGpa, 10.0);
      // If already achieved or exceeded target, show 0 or negative as achieved
      if (requiredFutureGpa <= 0) {
        requiredFutureGpa = 0; // Already achieved target
      }
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
  }, [semesters, gradePointsMap, user?.targetCgpa]);

  return (
    <div className="space-y-6 select-none animate-in fade-in duration-200">
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            Academic Performance & Trends
          </h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Semester-by-semester SGPA progression curve, credit distribution & cumulative analytics
          </p>
        </div>
      </div>

      {/* 6 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          { label: 'Overall CGPA', value: analyticsData.overallCgpa.toFixed(2), sub: 'out of 10.0 Cumulative', icon: Award, gradient: true },
          { label: 'Target CGPA', value: analyticsData.targetCgpa.toFixed(2), sub: 'Goal to Achieve', icon: Target, gradient: true },
          { label: 'Peak Performance', value: analyticsData.highestSgpa > 0 ? analyticsData.highestSgpa.toFixed(2) : '--', sub: `Highest SGPA (${analyticsData.highestSgpa})`, icon: Zap },
          { label: 'Earned Credits', value: analyticsData.totalCumCredits, sub: 'Total Academic Credits', icon: BookOpen },
          { label: 'Semesters', value: `${analyticsData.totalCompletedSemesters} / ${semesters.length}`, sub: 'Completed Semesters', icon: Layers }
        ].map((kpi, idx) => (
          <Card key={idx} className={`p-4 ${kpi.gradient ? 'bg-gradient-to-br from-indigo-600 to-indigo-800 text-white shadow-md shadow-indigo-500/15 border-indigo-400/20' : 'bg-white border-slate-100 shadow-sm'} relative overflow-hidden border`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-black uppercase tracking-wider ${kpi.gradient ? 'text-indigo-200' : 'text-slate-400'}`}>{kpi.label}</span>
              <kpi.icon className={`w-4 h-4 ${kpi.gradient ? 'text-amber-300' : 'text-amber-500'}`} />
            </div>
            <div className={`text-3xl font-black ${kpi.gradient ? 'text-white' : 'text-slate-900'}`}>{kpi.value}</div>
            <p className={`text-[11px] font-semibold mt-1 ${kpi.gradient ? 'text-indigo-100' : 'text-slate-500'}`}>{kpi.sub}</p>
          </Card>
        ))}
        {/* KPI 3: Required Future GPA (conditional structure) */}
        <Card className={`p-4 ${analyticsData.requiredFutureGpa === 0 ? 'bg-green-500/20 border-green-500/30' : analyticsData.requiredFutureGpa >= 10 ? 'bg-red-500/20 border-red-500/30' : 'bg-blue-500/20 border-blue-500/30'} border`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">Required Future GPA</span>
            {analyticsData.requiredFutureGpa === 0 ? <Check className="w-4 h-4 text-green-600" /> : analyticsData.requiredFutureGpa >= 10 ? <XCircle className="w-4 h-4 text-red-600" /> : <Zap className="w-4 h-4 text-amber-500" />}
          </div>
          <div className="text-3xl font-black text-slate-900">
            {analyticsData.requiredFutureGpa === 0 ? 'ACHIEVED!' : analyticsData.requiredFutureGpa >= 10 ? 'NOT POSSIBLE' : analyticsData.requiredFutureGpa.toFixed(2)}
          </div>
          <p className="text-[11px] text-slate-500 font-semibold mt-1">
            {analyticsData.requiredFutureGpa === 0 ? 'Target achieved!' : analyticsData.requiredFutureGpa >= 10 ? 'Cannot reach target with remaining credits' : `Need ${analyticsData.requiredFutureGpa.toFixed(2)} avg`}
          </p>
        </Card>
      </div>

      {/* Main Chart 1: Dual Series Progression Curve (SGPA vs CGPA) */}
      <Card className="p-6 border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">SGPA vs CGPA Progression Curve</h3>
            <p className="text-xs text-slate-500 font-semibold">Comparison of individual semester SGPA against overall cumulative CGPA</p>
          </div>
        </div>

        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analyticsData.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="cgpaGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="sgpaGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#F1F5F9" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: '#64748B', fontWeight: '800' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 10]}
                tick={{ fontSize: 11, fill: '#64748B', fontWeight: '800' }}
                axisLine={false}
                tickLine={false}
                ticks={[0, 2, 4, 6, 8, 10]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1E293B',
                  borderRadius: '12px',
                  color: '#fff',
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
                stroke="#4F46E5"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#cgpaGlow)"
                dot={{ r: 4, fill: '#4F46E5', strokeWidth: 1.5, stroke: '#fff' }}
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
            <span className="text-sm font-medium text-slate-700">Progress Toward Target CGPA</span>
            <span className="text-sm font-medium text-slate-700">
              {analyticsData.overallCgpa.toFixed(2)} / {analyticsData.targetCgpa.toFixed(2)}
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5">
            <div
              className={`
                h-2.5 rounded-full ${analyticsData.overallCgpa >= analyticsData.targetCgpa ?
                  'bg-green-600' :
                  analyticsData.overallCgpa >= analyticsData.targetCgpa * 0.8 ?
                  'bg-yellow-600' :
                  'bg-indigo-600'
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
        <Card className="p-5 border border-slate-100 shadow-sm lg:col-span-1">
          <div className="mb-3 pb-2 border-b border-slate-100">
            <h4 className="text-sm font-extrabold text-slate-900">Credits Load per Semester</h4>
            <p className="text-xs text-slate-400 font-semibold">Total course credit weight</p>
          </div>
          <div className="w-full h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid stroke="#F1F5F9" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748B', fontWeight: '800' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748B', fontWeight: '800' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1E293B', borderRadius: '10px', color: '#fff', fontSize: '11px', fontWeight: 'bold', border: 'none' }}
                  formatter={(val) => [`${val} Credits`, 'Credit Load']}
                />
                <Bar dataKey="credits" fill="#4F46E5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Detailed Breakdown Table */}
        <Card className="p-5 border border-slate-100 shadow-sm lg:col-span-2">
          <div className="mb-3 pb-2 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-extrabold text-slate-900">Semester Performance Breakdown</h4>
              <p className="text-xs text-slate-400 font-semibold">Detailed breakdown for each semester</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-semibold">
              <thead>
                <tr className="text-[11px] font-black uppercase text-slate-400 border-b border-slate-100 pb-2">
                  <th className="py-2.5 px-3">Semester</th>
                  <th className="py-2.5 px-3 text-center">Graded</th>
                  <th className="py-2.5 px-3 text-center">Credits</th>
                  <th className="py-2.5 px-3 text-center">SGPA</th>
                  <th className="py-2.5 px-3 text-center">CGPA</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                  <th className="py-2.5 px-3 text-center">Target Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {analyticsData.chartData.map((sem) => (
                  <tr key={sem.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-extrabold text-slate-900">{sem.fullName}</td>
                    <td className="py-2.5 px-3 text-center text-slate-600 font-bold">{sem.gradedCount} subjects</td>
                    <td className="py-2.5 px-3 text-center">
                      <Badge variant="purple" size="sm">{sem.credits} Credits</Badge>
                    </td>
                    <td className="py-2.5 px-3 text-center font-black text-slate-900">
                      {sem.sgpa > 0 ? sem.sgpa.toFixed(2) : '--'}
                    </td>
                    <td className="py-2.5 px-3 text-center font-black text-indigo-600">
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
                        <>
                          {sem.cgpa >= analyticsData.targetCgpa ? (
                            <span className="text-xs font-medium text-green-600">✓ Target Met</span>
                          ) : (
                            <span className="text-xs font-medium text-yellow-600">
                              {(sem.cgpa / analyticsData.targetCgpa * 100).toFixed(0)}% of target
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-xs font-medium text-slate-500">Not graded</span>
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