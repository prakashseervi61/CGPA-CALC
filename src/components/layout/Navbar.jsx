import { Menu, User } from 'lucide-react';
import { useUser } from '../../contexts/AuthContext';

export default function Navbar({ setMobileOpen }) {
  const { user } = useUser();

  const userName = user?.name || 'Student';
  const regNo = user?.registerNumber || user?.studentId || '';

  return (
    <header className="px-6 md:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md sticky top-0 z-30 shadow-2xs">
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
          <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2 leading-tight">
            Hello, {userName}! <span className="inline-block ml-1">👋</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
            Track your academic progress with Semora
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 ml-auto bg-slate-100/70 dark:bg-slate-700/50 border border-slate-200/80 dark:border-slate-600/80 rounded-xl px-3 py-1.5 select-none">
        <User className="w-4 h-4 text-indigo-500" />
        <div className="flex flex-col leading-tight">
          <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100">{userName}</span>
          {regNo && <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400">{regNo}</span>}
        </div>
      </div>
    </header>
  );
}