import React from 'react';
import CGPASummary from '../dashboard/CGPASummary';
import GradeDistribution from '../dashboard/GradeDistribution';

export default function RightPanel({ 
  cgpa = 8.56,
  sgpa = 8.60,
  totalCredits = 20,
  totalGradePoints = 172,
  courses = [],
  activeSemesterName = 'Semester 1'
}) {
  return (
    <aside className="w-full xl:w-[350px] shrink-0 p-4 sm:p-6 space-y-3.5 overflow-hidden select-none bg-[#EEEEFF] border-l border-slate-100/80">
      {/* Card 1: CGPA Summary */}
      <CGPASummary 
        cgpa={cgpa}
        sgpa={sgpa}
        totalCredits={totalCredits}
        totalGradePoints={totalGradePoints}
        activeSemesterName={activeSemesterName}
      />

      {/* Card 2: Grade Distribution */}
      <GradeDistribution courses={courses} />
    </aside>
  );
}
