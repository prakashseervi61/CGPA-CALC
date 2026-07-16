import { Menu, User } from 'lucide-react';
import { useUser } from '../../contexts/AuthContext';

export default function Navbar({ setMobileOpen }) {
  const { user } = useUser();

  const userName = user?.name || 'Student';
  const regNo = user?.registerNumber || user?.studentId || '';

  return (
    <header className="px-6 md:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md sticky top-0 z-30 shadow-2xs">
      {/* Left Greeting */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden p-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-100 dark:border-stone-700 dark:text-stone-400 dark:hover:bg-stone-800"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-lg md:text-xl font-black text-stone-900 dark:text-stone-100 flex items-center gap-2 leading-tight">
            Hello, {userName}! <span className="inline-block ml-1">👋</span>
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 font-semibold">
            Track your academic progress with Semora
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 ml-auto bg-stone-100/70 dark:bg-stone-800/50 border border-stone-200/80 dark:border-stone-700/80 rounded-xl px-3 py-1.5 select-none">
        <User className="w-4 h-4 text-primary" />
        <div className="flex flex-col leading-tight">
          <span className="text-xs font-extrabold text-stone-800 dark:text-stone-100">{userName}</span>
          {regNo && <span className="text-[10px] font-bold text-stone-400 dark:text-stone-500">{regNo}</span>}
        </div>
      </div>
    </header>
  );
}