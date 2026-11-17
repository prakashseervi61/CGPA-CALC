import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HelpCircle, ChevronDown, ChevronUp, Award, Lightbulb,
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

export default function HelpPage() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      q: 'How is Semester GPA (SGPA) calculated?',
      a: 'SGPA is calculated by taking the sum of (Course Credits × Grade Points) for all subjects in that semester, divided by the total sum of credits for that semester:\n\nSGPA = Σ(Credits × Grade Points) / Σ(Total Semester Credits)',
    },
    {
      q: 'How is Cumulative GPA (CGPA) calculated?',
      a: 'CGPA represents your overall academic performance across all completed semesters. It is computed as:\n\nCGPA = Σ(Earned Grade Points across all included semesters) / Σ(Earned Credits across all included semesters)',
    },
    {
      q: "What does the 'Include in CGPA / Exclude' toggle do?",
      a: 'If you toggle a semester to Excluded, its credits and grade points are temporarily omitted from your cumulative CGPA calculations. Useful for analyzing prospective scores or ignoring non-credit semesters.',
    },
    {
      q: 'What are the Grade Point values under SKCET Regulation 2022?',
      a: 'The grading scale uses the standard 10-point system:\n• Grade O (Outstanding): 10 Points (91–100%)\n• Grade A+ (Excellent): 9 Points (81–90%)\n• Grade A (Very Good): 8 Points (71–80%)\n• Grade B+ (Good): 7 Points (61–70%)\n• Grade B (Above Average): 6 Points (56–60%)\n• Grade C (Average): 5 Points (50–55%)\n• Grade U (Reappear/Fail): 0 Points (< 50%)',
    },
    {
      q: 'Where is my data stored and how do I reset it?',
      a: 'All your profiles, subject selections, and grade scores are stored locally in your browser\'s local storage. Your data never leaves your device. Use the Settings page to reset grades when needed.',
    },
  ];

  return (
    <div className="space-y-5 max-w-4xl select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border dark:border-border-strong">
        <div>
          <h2 className="text-xl font-black text-text-primary flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-light text-primary flex items-center justify-center shrink-0">
              <HelpCircle className="w-4 h-4" />
            </div>
            Help & Support Guide
          </h2>
          <p className="text-[10px] font-extrabold text-text-tertiary uppercase tracking-wider mt-0.5">
            Understanding SGPA & CGPA formulas, regulation grade scales & user guide
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>

      {/* Quick Start Guide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <StepCard number={1} iconBg="bg-primary-light" iconText="text-primary" title="Select Active Semester">
          Choose your current semester (Sem 1 to 8) from the semester dropdown.
        </StepCard>
        <StepCard number={2} iconBg="bg-success-light" iconText="text-success-text" title="Select Letter Grades">
          Pick your achieved grade (O, A+, A, B+, B, C, U) for each subject.
        </StepCard>
        <StepCard number={3} iconBg="bg-warning-light" iconText="text-warning" title="Instant SGPA & CGPA">
          View real-time SGPA, overall CGPA & grade distribution charts instantly.
        </StepCard>
      </div>

      {/* FAQ Section */}
      <Card variant="elevated">
        <div className="flex items-center gap-2.5 pb-3 border-b border-border dark:border-border-strong">
          <div className="w-8 h-8 rounded-lg bg-primary-light text-primary flex items-center justify-center shrink-0">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-text-primary">Frequently Asked Questions</h3>
            <p className="text-[10px] font-extrabold text-text-tertiary uppercase tracking-wider">
              Click any question to view answers
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-lg border border-border dark:border-border-strong overflow-hidden transition-all duration-200 bg-stone-50/40 dark:bg-stone-800/50"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                  className="w-full flex items-center justify-between p-3 text-left font-extrabold text-sm text-text-primary hover:text-primary hover:bg-primary-light/40 dark:hover:bg-primary-hover/20 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-primary shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-text-tertiary shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-3 pb-3 text-xs font-extrabold text-text-tertiary whitespace-pre-line leading-relaxed border-t border-border dark:border-border-strong pt-2 bg-surface dark:bg-surface-variant">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Grade Scale Reference */}
      <Card variant="elevated">
        <div className="flex items-center justify-between pb-3 border-b border-border dark:border-border-strong">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-success-light text-success-text flex items-center justify-center shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-text-primary">Grade Point Reference Scale</h3>
              <p className="text-[10px] font-extrabold text-text-tertiary uppercase tracking-wider">
                SKCET Regulation 2022 Grading System
              </p>
            </div>
          </div>
          <Badge variant="outline" size="sm">10.0 Scale</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-extrabold">
            <thead>
              <tr className="text-[10px] font-black uppercase text-text-tertiary border-b border-border dark:border-border-strong pb-2">
                <th className="py-2.5 px-3">Letter Grade</th>
                <th className="py-2.5 px-3 text-center">Grade Point</th>
                <th className="py-2.5 px-3 text-center">Marks Range</th>
                <th className="py-2.5 px-3 text-right">Classification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-border-strong">
              <tr className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                <td className="py-2.5 px-3 font-black text-success-text">O</td>
                <td className="py-2.5 px-3 text-center font-black text-text-primary">10.0</td>
                <td className="py-2.5 px-3 text-center text-text-tertiary">91 – 100%</td>
                <td className="py-2.5 px-3 text-right font-black text-text-secondary">Outstanding</td>
              </tr>
              <tr className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                <td className="py-2.5 px-3 font-black text-primary">A+</td>
                <td className="py-2.5 px-3 text-center font-black text-text-primary">9.0</td>
                <td className="py-2.5 px-3 text-center text-text-tertiary">81 – 90%</td>
                <td className="py-2.5 px-3 text-right font-black text-text-secondary">Excellent</td>
              </tr>
              <tr className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                <td className="py-2.5 px-3 font-black text-warning">A</td>
                <td className="py-2.5 px-3 text-center font-black text-text-primary">8.0</td>
                <td className="py-2.5 px-3 text-center text-text-tertiary">71 – 80%</td>
                <td className="py-2.5 px-3 text-right font-black text-text-secondary">Very Good</td>
              </tr>
              <tr className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                <td className="py-2.5 px-3 font-black text-warning">B+</td>
                <td className="py-2.5 px-3 text-center font-black text-text-primary">7.0</td>
                <td className="py-2.5 px-3 text-center text-text-tertiary">61 – 70%</td>
                <td className="py-2.5 px-3 text-right font-black text-text-secondary">Good</td>
              </tr>
              <tr className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                <td className="py-2.5 px-3 font-black text-warning">B</td>
                <td className="py-2.5 px-3 text-center font-black text-text-primary">6.0</td>
                <td className="py-2.5 px-3 text-center text-text-tertiary">56 – 60%</td>
                <td className="py-2.5 px-3 text-right font-black text-text-secondary">Above Average</td>
              </tr>
              <tr className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                <td className="py-2.5 px-3 font-black text-text-tertiary">C</td>
                <td className="py-2.5 px-3 text-center font-black text-text-primary">5.0</td>
                <td className="py-2.5 px-3 text-center text-text-tertiary">50 – 55%</td>
                <td className="py-2.5 px-3 text-right font-black text-text-secondary">Average</td>
              </tr>
              <tr className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                <td className="py-2.5 px-3 font-black text-danger-text">U</td>
                <td className="py-2.5 px-3 text-center font-black text-text-primary">0.0</td>
                <td className="py-2.5 px-3 text-center text-text-tertiary">&lt; 50%</td>
                <td className="py-2.5 px-3 text-right font-black text-danger-text">Reappear (Fail)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function StepCard({ number, iconBg, iconText, title, children }) {
  return (
    <Card variant="elevated" className="p-3 space-y-2">
      <div className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs">
        <span className={`${iconBg} ${iconText}`}>{number}</span>
      </div>
      <h3 className="font-extrabold text-xs text-text-primary">{title}</h3>
      <p className="text-[9px] font-extrabold text-text-tertiary leading-relaxed">
        {children}
      </p>
    </Card>
  );
}
