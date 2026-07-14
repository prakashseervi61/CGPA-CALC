import React, { useState } from 'react';
import { Award, Edit3, Check } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { useSesame } from '../../hooks/useSesame';

const DEFAULT_GRADE_SCALES = [
  { grade: 'O', point: 10, range: '91–100%', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  { grade: 'A+', point: 9, range: '81–90%', bg: 'bg-primary-100 text-primary-800 border-primary-200' },
  { grade: 'A', point: 8, range: '71–80%', bg: 'bg-blue-100 text-blue-800 border-blue-200' },
  { grade: 'B+', point: 7, range: '61–70%', bg: 'bg-amber-100 text-amber-800 border-amber-200' },
  { grade: 'B', point: 6, range: '56–60%', bg: 'bg-orange-100 text-orange-800 border-orange-200' },
  { grade: 'C', point: 5, range: '50–55%', bg: 'bg-slate-100 text-slate-800 border-slate-200' },
  { grade: 'U', point: 0, range: '< 50% (Reappear)', bg: 'bg-rose-100 text-rose-800 border-rose-200' },
];

export default function GradeScale() {
  const { gradeScaleRules, setGradeScaleRules } = useSesame();
  const [isEditing, setIsEditing] = useState(false);
  const [scales, setScales] = useState(gradeScaleRules ?? DEFAULT_GRADE_SCALES);

  const handlePointChange = (idx, newPoint) => {
    const updated = [...scales];
    updated[idx] = { ...updated[idx], point: Number(newPoint) };
    setScales(updated);
  };

  const saveScales = () => {
    setGradeScaleRules(scales);
    setIsEditing(false);
  };

  return (
    <Card className="shadow-sm border border-slate-100 mt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">
              Grade Scale
            </h3>
            <p className="text-xs text-slate-500 font-semibold">
              Standard 10-point academic grading evaluation rules
            </p>
          </div>
        </div>

        <Button
          variant={isEditing ? 'pastelGreen' : 'outline'}
          size="sm"
          icon={isEditing ? Check : Edit3}
          onClick={isEditing ? saveScales : () => setIsEditing(true)}
          className="rounded-2xl"
        >
          {isEditing ? 'Save Scale' : 'Edit Grade Scale'}
        </Button>
      </div>

      {/* Grade Chips Flex Container */}
      <div className="flex flex-wrap gap-3">
        {scales.map((item, idx) => (
          <div
            key={item.grade}
            className={`
              flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl border transition-all duration-200
              ${item.bg || 'bg-slate-100 text-slate-800 border-slate-200'}
              shadow-xs
            `}
          >
            {/* Grade Letter Circle */}
            <span className="w-7 h-7 rounded-xl bg-white/90 flex items-center justify-center font-black text-xs shadow-2xs">
              {item.grade}
            </span>

            {/* Points & Range */}
            <div className="flex flex-col">
              {isEditing ? (
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={item.point}
                    onChange={(e) => handlePointChange(idx, e.target.value)}
                    className="w-12 px-1.5 py-0.5 rounded border border-slate-300 text-xs font-bold text-center bg-white text-slate-900 focus:outline-none focus:border-primary-600"
                    min="0"
                    max="10"
                  />
                  <span className="text-[11px] font-bold">Pts</span>
                </div>
              ) : (
                <span className="text-xs font-black tracking-tight">
                  {item.point} {item.point === 1 ? 'Point' : 'Points'}
                </span>
              )}
              <span className="text-[10px] opacity-80 font-bold leading-tight">
                {item.range}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}