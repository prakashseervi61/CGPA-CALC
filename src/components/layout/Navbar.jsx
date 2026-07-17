import { Menu } from 'lucide-react';
import { useUser } from '../../contexts/AuthContext';
import ThemeToggle from '../ui/ThemeToggle';

export default function Navbar({ setMobileOpen }) {
  const { user } = useUser();
  const userName = user?.username || 'Student';

  return (
    <header className="px-4 md:px-8 py-3 md:py-3.5 flex items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md sticky top-0 z-30 shadow-2xs">
      {/* Left: hamburger + greeting */}
      <div className="flex items-center gap-2.5 min-w-0">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-100 dark:border-stone-700 dark:text-stone-400 dark:hover:bg-stone-800 shrink-0"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h2 className="text-base md:text-xl font-black text-stone-900 dark:text-stone-100 leading-tight truncate">
            Hello, {userName}! 👋
          </h2>
          <p className="text-[11px] md:text-xs text-stone-500 dark:text-stone-400 font-semibold hidden sm:block">
            Track your academic progress with Semora
          </p>
        </div>
      </div>

      {/* Right: theme toggle */}
      <ThemeToggle />
    </header>
  );
}