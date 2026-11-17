import { Menu, User, Bell } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';
import Badge from '../ui/Badge';

export default function Navbar({ setMobileOpen }) {
  return (
    <header className="px-4 md:px-8 py-3 md:py-3.5 flex items-center justify-between gap-3 border-b border-border dark:border-border-strong bg-surface/80 dark:bg-surface-variant/80 backdrop-blur-md sticky top-0 z-30 shadow-sm">
      {/* Left: hamburger + greeting */}
      <div className="flex items-center gap-2.5 min-w-0">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2.5 rounded-lg border border-border dark:border-border-strong text-text-secondary hover:text-text-primary hover:bg-stone-50 dark:hover:bg-stone-800/50 shrink-0 transition-all duration-200"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h2 className="text-base md:text-xl font-black text-text-primary leading-tight truncate">
            Welcome back
          </h2>
          <p className="text-[10px] md:text-xs text-text-tertiary font-extrabold hidden sm:block uppercase tracking-wider">
            Track your academic progress with Semora
          </p>
        </div>
      </div>

      {/* Right: notifications + theme toggle */}
      <div className="flex items-center gap-2">
        <button
          className="p-2.5 rounded-lg border border-border dark:border-border-strong text-text-secondary hover:text-text-primary hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-all duration-200 shrink-0"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-danger text-white text-[8px] flex items-center justify-center font-black">
            0
          </span>
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
}
