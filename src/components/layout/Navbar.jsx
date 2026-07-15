import { Menu, ChevronDown } from 'lucide-react';
import { useSesame } from '../../hooks/useSesame';

export default function Navbar({ setMobileOpen }) {
  const {
    currentSemesterId,
    setCurrentSemesterId,
    semesters,
    user
  } = useSesame();

  const userName = user?.name || 'Student';

  return (
    <header className="px-6 md:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-30 shadow-2xs">
      {/* Left Greeting */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-lg md:text-xl font-black text-slate-900 flex items-center gap-2 leading-tight">
            Hello, {userName}! <span className="inline-block ml-1">👋</span>
          </h2>
          <p className="text-xs text-slate-500 font-semibold">
            Track your academic progress with Semora
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Semester Select Dropdown */}
        <div className="flex items-center gap-2 bg-slate-100/70 border border-slate-200/80 rounded-xl px-3 py-1.5 hover:border-indigo-400/50 hover:bg-indigo-50/40 transition-all duration-200 cursor-pointer">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider hidden sm:inline leading-none">Sem</span>
          <select
            value={currentSemesterId}
            onChange={(e) => setCurrentSemesterId(Number(e.target.value))}
            className="bg-transparent text-slate-800 font-extrabold text-xs focus:outline-none cursor-pointer pr-3 appearance-none"
          >
            {semesters.map((sem) => (
              <option key={sem.id} value={sem.id} className="bg-white text-slate-800">
                {sem.name} {sem.courses?.length ? `(${sem.courses.length})` : ''}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3 h-3 text-slate-400 pointer-events-none shrink-0" />
        </div>
      </div>
    </header>
  );
}