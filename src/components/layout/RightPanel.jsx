import React from 'react';
import CGPASummary from '../dashboard/CGPASummary';
import GradeDistribution from '../dashboard/GradeDistribution';
import { useSesame } from '../../hooks/useSesame';

export default function RightPanel() {
  const {
    overallCgpaCalculations,
    semesterCalculations,
    activeSemester
  } = useSesame();

  // Use overall CGPA for cumulative, and current semester SGPA for semester
  const cgpa = overallCgpaCalculations.cgpa ?? 0;
  const sgpa = semesterCalculations.sgpa ?? 0;
  const totalCredits = overallCgpaCalculations.totalCumCredits ?? 0;
  const totalGradePoints = overallCgpaCalculations.totalCumPoints ?? 0;
  const activeSemesterName = activeSemester?.name || 'Semester 1';

  return (
    <aside className="w-full xl:w-[350px] shrink-0 p-4 sm:p-6 space-y-3.5 overflow-hidden select-none bg-white border-l border-slate-100/80 dark:bg-slate-800">
      {/* Card 1: CGPA Summary */}
      <CGPASummary />

      {/* Card 2: Grade Distribution */}
      <GradeDistribution />
    </aside>
  );
}