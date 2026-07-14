import React from 'react';
import { Zap, BookOpen, Star, Check } from 'lucide-react';
import { useSesame } from '../../hooks/useSesame';
import { useUser } from '../../hooks/useUser';

export default function CGPASummary() {
  const {
    overallCgpaCalculations,
    semesterCalculations,
    activeSemester
  } = useSesame();
  const { user } = useUser();
  const targetCgpa = parseFloat(user?.targetCgpa) || 9.00;
  const currentCgpa = overallCgpaCalculations.cgpa ?? 0;
  const sgpa = semesterCalculations.sgpa ?? 0;
  const totalCredits = overallCgpaCalculations.totalCumCredits ?? 0;
  const totalGradePoints = overallCgpaCalculations.totalCumPoints ?? 0;
  const activeSemesterName = activeSemester?.name || 'Semester 1';

  // Format numbers cleanly
  const formattedCgpa = typeof currentCgpa === 'number' && !isNaN(currentCgpa) ? currentCgpa.toFixed(2) : '0.00';
  const formattedSgpa = typeof sgpa === 'number' && !isNaN(sgpa) ? sgpa.toFixed(2) : '0.00';
  const formattedTargetCgpa = typeof targetCgpa === 'number' && !isNaN(targetCgpa) ? targetCgpa.toFixed(2) : '9.00';

  const getMotivation = (val) => {
    const score = parseFloat(val);
    if (score >= 9.0) return '🎉 Distinction! Outstanding academic performance!';
    if (score >= 8.0) return '🌟 Excellent work! You are in the top tier.';
    if (score >= 7.0) return '👍 Very Good! Keep pushing for distinction.';
    if (score >= 6.0) return '💪 Good effort! Aim higher next semester.';
    return '🚀 Keep practicing and stay consistent!';
  };

  // Calculate progress toward target (as percentage)
  const progressToTarget = Math.min((currentCgpa / targetCgpa) * 100, 100);
  const isTargetAchieved = currentCgpa >= targetCgpa;

  return (
    <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white rounded-[24px] p-5 shadow-lg shadow-primary-500/20 relative overflow-hidden select-none border border-primary-400/20">
      {/* Decorative Glow Elements */}
      <div className="absolute -top-10 -right-10 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-amber-300">
            <Star className="w-4 h-4 fill-amber-300" />
          </div>
          <span className="text-xs font-black tracking-wider uppercase text-primary-100">
            Overall CGPA
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-xl bg-white/15 backdrop-blur-md text-white border border-white/10">
            Target: {formattedTargetCgpa}
          </span>
          {isTargetAchieved && (
            <Check className="w-4 h-4 text-green-400" />
          )}
        </div>
      </div>

      {/* Big CGPA Display */}
      <div className="my-2.5 relative z-10 flex items-baseline gap-3">
        <span className="font-heading text-5xl font-black tracking-tight text-white drop-shadow-sm leading-none">
          {formattedCgpa}
        </span>
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase text-primary-200 tracking-wider">
            out of 10.0
          </span>
          <span className="text-xs text-primary-200/90 font-semibold">
            SGPA: <span className="font-bold text-white">{formattedSgpa}</span> ({activeSemesterName})
          </span>
        </div>
      </div>

      {/* Target Progress Bar */}
      <div className="my-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-black text-primary-200">Target Progress</span>
          <span className="text-xs font-bold text-primary-600">
            {progressToTarget.toFixed(0)}% {isTargetAchieved ? '(Achieved!)' : ''}
          </span>
        </div>
        <div className="w-full bg-primary-50 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r from-primary-600 to-primary-800 transition-all duration-1000 ease-out`}
            style={{ width: `${progressToTarget}%` }}
          ></div>
        </div>
      </div>

      {/* Motivational Text */}
      <p className="text-xs text-primary-100 font-bold mb-4 relative z-10 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/10 truncate">
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
            <span className="text-[9px] uppercase font-bold text-primary-200 tracking-wider block leading-none mb-1">
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
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold text-primary-200 tracking-wider block leading-none mb-1">
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