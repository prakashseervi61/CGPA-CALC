import React, { useMemo } from 'react';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend 
} from 'recharts';
import { TrendingUp, Award, Zap, BookOpen, Layers, CheckCircle2, XCircle } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

export default function CGPATrendsPage({ semesters = [], gradePointsMap = {} }) {
  // Compute analytics and chart datasets across all semesters
  const analyticsData = useMemo(() => {
    let cumPoints = 0;
    let cumCredits = 0;
    let highestSgpa = 0;
    let highestSemName = 'None';
    let totalCompletedSemesters = 0;

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

    return {
      chartData,
      overallCgpa: Number(overallCgpa.toFixed(2)),
      totalCumCredits: cumCredits,
      totalCumPoints: cumPoints,
      highestSgpa: Number(highestSgpa.toFixed(2)),
      highestSemName,
      totalCompletedSemesters
    };
  }, [semesters, gradePointsMap]);

  return (
    <div className="space-y-6 select-none animate-in fade-in duration-200">
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E0E7FF] text-[#4F46E5] flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            Academic Performance & Trends
          </h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Semester-by-semester SGPA progression curve, credit distribution & cumulative analytics
          </p>
        </div>
      </div>

      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Overall CGPA */}
        <Card className="p-4 bg-gradient-to-br from-[#4F46E5] to-[#3730A3] text-white shadow-md shadow-indigo-500/15 relative overflow-hidden border border-indigo-400/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-indigo-200">Overall CGPA</span>
            <Award className="w-4 h-4 text-amber-300" />
          </div>
          <div className="text-3xl font-black">{analyticsData.overallCgpa.toFixed(2)}</div>
          <p className="text-[11px] text-indigo-100 font-semibold mt-1">out of 10.0 Cumulative</p>
        </Card>

        {/* KPI 2: Highest SGPA */}
        <Card className="p-4 bg-white border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">Peak Performance</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {analyticsData.highestSgpa > 0 ? analyticsData.highestSgpa.toFixed(2) : '--'}
          </div>
          <p className="text-[11px] text-slate-500 font-semibold mt-1">
            Highest SGPA ({analyticsData.highestSemName})
          </p>
        </Card>

        {/* KPI 3: Total Credits */}
        <Card className="p-4 bg-white border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">Earned Credits</span>
            <BookOpen className="w-4 h-4 text-[#4F46E5]" />
          </div>
          <div className="text-3xl font-black text-slate-900">{analyticsData.totalCumCredits}</div>
          <p className="text-[11px] text-slate-500 font-semibold mt-1">Total Academic Credits</p>
        </Card>

        {/* KPI 4: Completed Semesters */}
        <Card className="p-4 bg-white border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">Semesters</span>
            <Layers className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">{analyticsData.totalCompletedSemesters} / {semesters.length}</div>
          <p className="text-[11px] text-slate-500 font-semibold mt-1">Completed Semesters</p>
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
                    <td className="py-2.5 px-3 text-center font-black text-[#4F46E5]">
                      {sem.cgpa > 0 ? sem.cgpa.toFixed(2) : '--'}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <Badge variant={sem.included ? 'green' : 'slate'} size="sm">
                        {sem.included ? 'Included' : 'Excluded'}
                      </Badge>
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
