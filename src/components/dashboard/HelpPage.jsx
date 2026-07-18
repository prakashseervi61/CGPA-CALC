import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HelpCircle, ChevronDown, ChevronUp, Award, Lightbulb
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

export default function HelpPage() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(0); // Open first FAQ by default

  const faqs = [
    {
      q: "How is Semester GPA (SGPA) calculated?",
      a: "SGPA is calculated by taking the sum of (Course Credits × Grade Points) for all subjects in that semester, divided by the total sum of credits for that semester:\n\nSGPA = Σ(Credits × Grade Points) / Σ(Total Semester Credits)"
    },
    {
      q: "How is Cumulative GPA (CGPA) calculated?",
      a: "CGPA represents your overall academic performance across all completed semesters. It is computed as:\n\nCGPA = Σ(Earned Grade Points across all included semesters) / Σ(Earned Credits across all included semesters)"
    },
    {
      q: "What does the 'Include in CGPA / Exclude' toggle button do?",
      a: "If you toggle a semester to 'Excluded from CGPA', its credits and grade points will be temporarily omitted from your cumulative CGPA calculations. This is useful for analyzing prospective scores or ignoring specific non-credit semesters."
    },
    {
      q: "What are the Grade Point values under SKCET Regulation 2022?",
      a: "The grading scale uses the standard 10-point system:\n• Grade O (Outstanding): 10 Points (91–100%)\n• Grade A+ (Excellent): 9 Points (81–90%)\n• Grade A (Very Good): 8 Points (71–80%)\n• Grade B+ (Good): 7 Points (61–70%)\n• Grade B (Above Average): 6 Points (56–60%)\n• Grade C (Average): 5 Points (50–55%)\n• Grade U (Reappear/Fail): 0 Points (< 50%)"
    },
    {
      q: "Where is my data stored and how do I reset it?",
      a: "All your profiles, subject selections, and grade scores are stored locally in your browser's local storage. Your data never leaves your device. Use the Settings page to reset grades when needed."
    }
  ];

  return (
    <div className="space-y-6 max-w-4xl select-none duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-stone-700">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-stone-50 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary-light text-primary flex items-center justify-center shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            Help & Support Guide
          </h2>
            <p className="text-xs text-slate-500 dark:text-stone-400 font-semibold mt-1">
            Understanding SGPA & CGPA formulas, regulation grade scales, and user guide
          </p>
        </div>

        <Button variant="secondary" size="sm" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>

      {/* 3-STEP QUICK START GUIDE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Step 1 */}
        <Card className="p-4 border border-slate-100 dark:border-stone-700 bg-white dark:bg-stone-900 shadow-sm space-y-2">
          <div className="w-8 h-8 rounded-xl bg-primary-light text-primary flex items-center justify-center font-black text-sm">
            1
          </div>
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-stone-50">Select Active Semester</h3>
          <p className="text-xs text-slate-500 dark:text-stone-400 font-semibold leading-relaxed">
            Choose your current semester (Sem 1 to 8) from the top right dropdown navbar.
          </p>
        </Card>

        {/* Step 2 */}
        <Card className="p-4 border border-slate-100 dark:border-stone-700 bg-white dark:bg-stone-900 shadow-sm space-y-2">
          <div className="w-8 h-8 rounded-xl bg-[#D4E8D6] text-[#4A6E4D] flex items-center justify-center font-black text-sm">
            2
          </div>
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-stone-50">Select Letter Grades</h3>
          <p className="text-xs text-slate-500 dark:text-stone-400 font-semibold leading-relaxed">
            Pick your achieved grade (O, A+, A, B+, B, C, U) for each subject in the table.
          </p>
        </Card>

        {/* Step 3 */}
        <Card className="p-4 border border-slate-100 dark:border-stone-700 bg-white dark:bg-stone-900 shadow-sm space-y-2">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-black text-sm">
            3
          </div>
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-stone-50">Instant SGPA & CGPA</h3>
          <p className="text-xs text-slate-500 dark:text-stone-400 font-semibold leading-relaxed">
            View your real-time SGPA, overall CGPA, and grade distribution charts instantly!
          </p>
        </Card>
      </div>

      {/* FAQ SECTION */}
      <Card className="p-6 border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-stone-700">
          <div className="w-8 h-8 rounded-xl bg-primary-light text-primary flex items-center justify-center shrink-0">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-stone-50">Frequently Asked Questions</h3>
            <p className="text-xs text-slate-500 dark:text-stone-500 font-semibold">Click any question to view answers</p>
          </div>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200/80 dark:border-stone-600 rounded-2xl overflow-hidden transition-all duration-200 bg-slate-50/40 dark:bg-stone-800/50"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                  className="w-full flex items-center justify-between p-4 text-left font-black text-sm text-slate-800 dark:text-stone-100 hover:text-primary transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-primary shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 text-xs font-semibold text-slate-600 dark:text-stone-400 whitespace-pre-line leading-relaxed border-t border-slate-100 dark:border-stone-700 pt-3 bg-white dark:bg-stone-900">
                    {faq.a}
                  </div>
                )}
              </div>
              );
          })}
        </div>
      </Card>

      {/* REGULATION 2022 GRADE SCALE REFERENCE TABLE */}
      <Card className="p-6 border border-slate-100 dark:border-stone-700 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-stone-700">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#D4E8D6] text-[#4A6E4D] flex items-center justify-center shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-stone-50">Grade Point Reference Scale</h3>
              <p className="text-xs text-slate-400 dark:text-stone-500 font-semibold">SKCET Regulation 2022 Grading System</p>
            </div>
          </div>
          <Badge variant="purple" size="sm">10.0 Scale</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-semibold">
            <thead>
              <tr className="text-[11px] font-black uppercase text-slate-500 dark:text-stone-500 border-b border-slate-100 dark:border-stone-700 pb-2">
                <th className="py-2.5 px-3">Letter Grade</th>
                <th className="py-2.5 px-3 text-center">Grade Point</th>
                <th className="py-2.5 px-3 text-center">Marks Range</th>
                <th className="py-2.5 px-3 text-right">Classification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-stone-700">
              <tr className="hover:bg-slate-50 dark:hover:bg-stone-800">
                <td className="py-2.5 px-3 font-black text-[#4A6E4D]">O</td>
                <td className="py-2.5 px-3 text-center font-black text-slate-900 dark:text-stone-100">10.0</td>
                <td className="py-2.5 px-3 text-center text-slate-600 dark:text-stone-400">91 – 100%</td>
                <td className="py-2.5 px-3 text-right font-bold text-slate-700 dark:text-stone-300">Outstanding</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-stone-800">
                <td className="py-2.5 px-3 font-black text-primary">A+</td>
                <td className="py-2.5 px-3 text-center font-black text-slate-900 dark:text-stone-100">9.0</td>
                <td className="py-2.5 px-3 text-center text-slate-600 dark:text-stone-400">81 – 90%</td>
                <td className="py-2.5 px-3 text-right font-bold text-slate-700 dark:text-stone-300">Excellent</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-stone-800">
                <td className="py-2.5 px-3 font-black text-amber-600">A</td>
                <td className="py-2.5 px-3 text-center font-black text-slate-900 dark:text-stone-100">8.0</td>
                <td className="py-2.5 px-3 text-center text-slate-600 dark:text-stone-400">71 – 80%</td>
                <td className="py-2.5 px-3 text-right font-bold text-slate-700 dark:text-stone-300">Very Good</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-stone-800">
                <td className="py-2.5 px-3 font-black text-amber-600">B+</td>
                <td className="py-2.5 px-3 text-center font-black text-slate-900 dark:text-stone-100">7.0</td>
                <td className="py-2.5 px-3 text-center text-slate-600 dark:text-stone-400">61 – 70%</td>
                <td className="py-2.5 px-3 text-right font-bold text-slate-700 dark:text-stone-300">Good</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-stone-800">
                <td className="py-2.5 px-3 font-black text-orange-600">B</td>
                <td className="py-2.5 px-3 text-center font-black text-slate-900 dark:text-stone-100">6.0</td>
                <td className="py-2.5 px-3 text-center text-slate-600 dark:text-stone-400">56 – 60%</td>
                <td className="py-2.5 px-3 text-right font-bold text-slate-700 dark:text-stone-300">Above Average</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-stone-800">
                <td className="py-2.5 px-3 font-black text-slate-600 dark:text-stone-400">C</td>
                <td className="py-2.5 px-3 text-center font-black text-slate-900 dark:text-stone-100">5.0</td>
                <td className="py-2.5 px-3 text-center text-slate-600 dark:text-stone-400">50 – 55%</td>
                <td className="py-2.5 px-3 text-right font-bold text-slate-700 dark:text-stone-300">Average</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-stone-800">
                <td className="py-2.5 px-3 font-black text-rose-600">U</td>
                <td className="py-2.5 px-3 text-center font-black text-slate-900 dark:text-stone-100">0.0</td>
                <td className="py-2.5 px-3 text-center text-slate-600 dark:text-stone-400">{'< 50%'}</td>
                <td className="py-2.5 px-3 text-right font-bold text-rose-600">Reappear (Fail)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}