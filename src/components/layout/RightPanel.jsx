import React from 'react';
import CGPASummary from '../dashboard/CGPASummary';
import GradeDistribution from '../dashboard/GradeDistribution';

export default function RightPanel() {
  return (
    <aside className="w-full xl:w-[350px] shrink-0 p-4 sm:p-6 space-y-3.5 overflow-hidden select-none bg-white border-l border-slate-100/80 dark:bg-slate-800">
      {/* Card 1: CGPA Summary */}
      <CGPASummary />

      {/* Card 2: Grade Distribution */}
      <GradeDistribution />
    </aside>
  );
}