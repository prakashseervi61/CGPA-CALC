import React from 'react';
import { Zap, BookOpen, Star } from 'lucide-react';

export default function CGPASummary({ 
  cgpa = 8.56, 
  totalCredits = 20, 
  totalGradePoints = 172,
  activeSemesterName = 'Semester 1',
  sgpa = 8.60
}) {
  // Format numbers cleanly
  const formattedCgpa = typeof cgpa === 'number' && !isNaN(cgpa) ? cgpa.toFixed(2) : '0.00';
  const formattedSgpa = typeof sgpa === 'number' && !isNaN(sgpa) ? sgpa.toFixed(2) : '0.00';

  const getMotivation = (val) => {
    const score = parseFloat(val);
    if (score >= 9.0) return '🎉 Distinction! Outstanding academic performance!';
    if (score >= 8.0) return '🌟 Excellent work! You are in the top tier.';
    if (score >= 7.0) return '👍 Very Good! Keep pushing for distinction.';
    if (score >= 6.0) return '💪 Good effort! Aim higher next semester.';
    return '🚀 Keep practicing and stay consistent!';
  };

  return (
    <div className="bg-gradient-to-br from-[#4F46E5] via-[#4740D4] to-[#3730A3] text-white rounded-[24px] p-5 shadow-lg shadow-indigo-500/20 relative overflow-hidden select-none border border-indigo-400/20">
      {/* Decorative Glow Elements */}
      <div className="absolute -top-10 -right-10 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-amber-300">
            <Star className="w-4 h-4 fill-amber-300" />
          </div>
          <span className="text-xs font-black tracking-wider uppercase text-indigo-100">
            Overall CGPA
          </span>
        </div>
        <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-xl bg-white/15 backdrop-blur-md text-white border border-white/10">
          Cumulative
        </span>
      </div>

      {/* Big CGPA Display */}
      <div className="my-2.5 relative z-10 flex items-baseline gap-3">
        <span className="font-heading text-5xl font-black tracking-tight text-white drop-shadow-sm leading-none">
          {formattedCgpa}
        </span>
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase text-indigo-200 tracking-wider">
            out of 10.0
          </span>
          <span className="text-xs text-indigo-200/90 font-semibold">
            SGPA: <span className="font-bold text-white">{formattedSgpa}</span> ({activeSemesterName})
          </span>
        </div>
      </div>

      {/* Motivational Text */}
      <p className="text-xs text-indigo-100 font-bold mb-4 relative z-10 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/10 truncate">
        {getMotivation(formattedCgpa)}
      </p>

      {/* Two Small Stat Cards */}
      <div className="grid grid-cols-2 gap-3 relative z-10">
        {/* Total Credits */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold text-indigo-200 tracking-wider block leading-none mb-1">
              Total Credits
            </span>
            <span className="text-sm font-black text-white leading-none">
              {totalCredits}
            </span>
          </div>
        </div>

        {/* Total Grade Points */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold text-indigo-200 tracking-wider block leading-none mb-1">
              Grade Points
            </span>
            <span className="text-sm font-black text-white leading-none">
              {totalGradePoints}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
