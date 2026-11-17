import { useState } from 'react';
import { Award, Edit3, Check } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { useData } from '../../contexts/DataContext';

export default function GradeScale() {
  const { gradeScaleRules, handleUpdateGradeScale } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [scales, setScales] = useState(gradeScaleRules);

  const handlePointChange = (idx, newPoint) => {
    const updated = [...scales];
    updated[idx] = { ...updated[idx], point: Math.max(0, Math.min(10, Number(newPoint) || 0)) };
    setScales(updated);
  };

  const saveScales = () => {
    handleUpdateGradeScale(scales);
    setIsEditing(false);
  };

  return (
    <Card variant="elevated" className="mt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-border dark:border-border-strong">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-success-light text-success-text flex items-center justify-center shrink-0">
            <Award className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-text-primary leading-tight">Grade Scale</h3>
            <p className="text-[10px] font-extrabold text-text-tertiary uppercase tracking-wider">
              Standard 10-point academic grading evaluation rules
            </p>
          </div>
        </div>

        <Button
          variant={isEditing ? 'success' : 'outline'}
          size="sm"
          icon={isEditing ? Check : Edit3}
          onClick={isEditing ? saveScales : () => setIsEditing(true)}
        >
          {isEditing ? 'Save Scale' : 'Edit Grade Scale'}
        </Button>
      </div>

      {/* Grade Scale Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {scales.map((item, idx) => (
          <div
            key={item.grade}
            className={`flex flex-col items-center gap-1.5 px-2.5 py-2.5 rounded-lg border transition-all duration-200 ${item.bg || 'bg-surface dark:bg-surface-variant border-border dark:border-border-strong'}`}
          >
            {/* Grade Letter */}
            <span className="w-7 h-7 rounded-lg bg-white/60 dark:bg-white/10 flex items-center justify-center shrink-0 font-extrabold text-xs text-text-primary">
              {item.grade}
            </span>
            {/* Points & Range */}
            <div className="text-center">
              {isEditing ? (
                <div className="flex items-center justify-center gap-1">
                  <Input
                    id={`grade-point-${item.grade}`}
                    type="number"
                    value={item.point}
                    onChange={(e) => handlePointChange(idx, e.target.value)}
                    inputMode="numeric"
                    maxLength="2"
                    className="w-10 py-0 text-[10px] font-extrabold text-center border-none focus:ring-0 focus:border-transparent bg-transparent"
                    label=""
                  />
                  <span className="text-[9px] font-extrabold text-text-tertiary">Pts</span>
                </div>
              ) : (
                <span className="text-[10px] font-black text-text-primary">
                  {item.point}
                </span>
              )}
              <span className="text-[9px] font-extrabold text-text-tertiary uppercase tracking-wider">
                {item.range}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
