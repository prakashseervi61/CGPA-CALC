import { Zap, BookOpen, Star, Check } from 'lucide-react';
import { useSesame } from '../../contexts/DataContext';
import { useUser } from '../../contexts/AuthContext';

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
    <div className="bg-gradient-to-br from-[#C27856] via-[#A8623E] to-[#8B4F32] text-white rounded-[24px] p-5 shadow-lg shadow-[#C27856]/20 relative overflow-hidden select-none border border-[#D4956F]/20 shrink-0">
      {/* Decorative Glow Elements */}
      <div className="absolute -top-10 -right-10 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-amber-300">
            <Star className="w-4 h-4 fill-amber-300" />
          </div>
          <span className="text-xs font-black tracking-wider uppercase text-white/70">
            Overall CGPA
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-xl bg-white/15 backdrop-blur-md text-white border border-white/10">
            Target: {formattedTargetCgpa}
          </span>
          {isTargetAchieved && (
            <Check className="w-4 h-4 text-emerald-300" />
          )}
        </div>
      </div>

      {/* Big CGPA Display */}
      <div className="my-2.5 relative z-10 flex items-baseline gap-3">
        <span className="text-5xl font-black tracking-tight text-white drop-shadow-sm leading-none">
          {formattedCgpa}
        </span>
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase text-white/70 tracking-wider">
            out of 10.0
          </span>
          <span className="text-xs text-white/80 font-semibold truncate max-w-[180px]">
            SGPA: <span className="font-bold text-white">{formattedSgpa}</span> ({activeSemesterName})
          </span>
        </div>
      </div>

      {/* Target Progress Bar */}
      <div className="my-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-black text-white/70">Target Progress</span>
          <span className="text-xs font-bold text-white/70">
            {progressToTarget.toFixed(0)}% {isTargetAchieved ? '(Achieved!)' : ''}
          </span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r from-white/80 to-white/50 transition-all duration-1000 ease-out`}
            style={{ width: `${progressToTarget}%` }}
          ></div>
        </div>
      </div>

      {/* Motivational Text */}
      <p className="text-xs text-white/80 font-bold mb-4 relative z-10 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/10 truncate">
        {getMotivation(formattedCgpa)}
      </p>

      {/* Two Small Stat Cards */}
      <div className="grid grid-cols-2 gap-3 relative z-10">
        {[
          { icon: BookOpen, label: 'Total Credits', value: totalCredits },
          { icon: Zap, label: 'Grade Points', value: totalGradePoints }
        ].map((item, idx) => (
          <div key={idx} className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <item.icon className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-white/70 tracking-wider block leading-none mb-1">{item.label}</span>
              <span className="text-sm font-black text-white leading-none">{item.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}