import { Zap, BookOpen, Star } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { useData } from '../../contexts/DataContext';

export default function CGPASummary() {
  const {
    overallCgpaCalculations,
    semesterCalculations,
    activeSemester,
  } = useData();

  const targetCgpa = 9.00;
  const currentCgpa = overallCgpaCalculations.cgpa ?? 0;
  const sgpa = semesterCalculations.sgpa ?? 0;
  const totalCredits = overallCgpaCalculations.totalCumCredits ?? 0;
  const totalGradePoints = overallCgpaCalculations.totalCumPoints ?? 0;
  const activeSemesterName = activeSemester?.name || 'Semester 1';

  const formattedCgpa = currentCgpa.toFixed(2);
  const formattedSgpa = sgpa.toFixed(2);
  const formattedTargetCgpa = targetCgpa.toFixed(2);

  const getMotivation = (score) => {
    if (score >= 9.0) return 'Distinction! Outstanding academic performance.';
    if (score >= 8.0) return 'Excellent work! You are in the top tier.';
    if (score >= 7.0) return 'Very good! Keep pushing for distinction.';
    if (score >= 6.0) return 'Good effort! Aim higher next semester.';
    return 'Keep practicing and stay consistent.';
  };

  const progressToTarget = Math.min((currentCgpa / targetCgpa) * 100, 100);
  const isTargetAchieved = currentCgpa >= targetCgpa;

  // Determine color based on progress
  const getCgpaColor = (score) => {
    if (score >= targetCgpa) return 'success';
    if (score >= targetCgpa * 0.8) return 'primary';
    return 'warning';
  };

  return (
    <Card variant="elevated" className="shrink-0 min-w-[320px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-border dark:border-border-strong">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary-light text-primary flex items-center justify-center shrink-0">
            <Star className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-black text-sm text-text-primary leading-tight">Overall CGPA</h3>
            <p className="text-[10px] font-extrabold text-text-tertiary uppercase tracking-wider">
              Semester-based academic performance
            </p>
          </div>
        </div>
        <Badge variant="outline" size="sm" className="whitespace-nowrap">
          Target: {formattedTargetCgpa}
        </Badge>
      </div>

      {/* Big CGPA Display */}
      <div className="mb-4 relative z-10 flex items-baseline gap-3">
        <span className="text-5xl font-black text-text-primary tracking-tight leading-none">
          {formattedCgpa}
        </span>
        <div className="flex flex-col">
          <span className="text-[10px] font-extrabold text-text-tertiary uppercase tracking-wider block leading-none mb-0.5">
            Out of 10.0
          </span>
          <span className="text-xs font-extrabold text-text-secondary">
            SGPA: <span className="text-text-primary font-black">{formattedSgpa}</span> (
            {activeSemesterName})
          </span>
        </div>
      </div>

      {/* Target Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-extrabold text-text-secondary uppercase tracking-wider">
            Target Progress
          </span>
          <span className="text-[10px] font-black text-text-primary">
            {progressToTarget.toFixed(0)}%
          </span>
        </div>
        <div className="w-full bg-border dark:bg-border-strong rounded-full h-2 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out ${isTargetAchieved ? 'bg-success' : progressToTarget >= 80 ? 'bg-warning' : 'bg-primary'}`}
            style={{ width: `${progressToTarget}%` }}
          />
        </div>
        <p className="text-[9px] font-extrabold text-text-tertiary mt-1">
          {isTargetAchieved
            ? 'Target achieved! 🎉'
            : `${(targetCgpa - currentCgpa).toFixed(2)} more to reach target`}
        </p>
      </div>

      {/* Motivational Text */}
      <p className="text-[10px] font-extrabold text-text-tertiary mb-4 px-3 py-2 rounded-lg border border-border dark:border-border-strong bg-stone-50 dark:bg-stone-800/50">
        {getMotivation(currentCgpa)}
      </p>

      {/* Stat Grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={BookOpen}
          label="Total Credits"
          value={totalCredits}
          variant="primary"
        />
        <StatCard
          icon={Zap}
          label="Grade Points"
          value={totalGradePoints}
          variant="success"
        />
      </div>
    </Card>
  );
}

function StatCard({ icon: Icon, label, value, variant }) {
  const variantColors = {
    primary: 'bg-primary-light text-primary-hover border-primary-border',
    success: 'bg-success-light text-success-text border-success-border',
  };
  return (
    <div className={`p-3 rounded-xl border flex items-center gap-2.5 ${variantColors[variant]}`}>
      <div className="w-7 h-7 rounded-lg bg-white/60 dark:bg-white/10 flex items-center justify-center shrink-0">
        <Icon className="w-3.5 h-3.5" />
      </div>
      <div>
        <span className="text-[9px] font-extrabold text-text-tertiary uppercase tracking-wider block leading-none mb-0.5">
          {label}
        </span>
        <span className="text-xs font-black text-text-primary leading-none">{value}</span>
      </div>
    </div>
  );
}
