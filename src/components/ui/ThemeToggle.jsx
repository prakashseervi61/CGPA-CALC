import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Dark mode' : 'Light mode'}
      className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-200/80 dark:border-stone-700/80 bg-stone-100/70 dark:bg-stone-800/50 hover:bg-stone-200/70 dark:hover:bg-stone-700/50 transition-all duration-200 cursor-pointer shrink-0"
    >
      {theme === 'dark' ? (
        <Moon className="w-4 h-4 text-primary/40" />
      ) : (
        <Sun className="w-4 h-4 text-primary" />
      )}
      <span className="text-xs font-bold text-stone-700 dark:text-stone-300 hidden sm:inline">
        {theme === 'dark' ? 'Dark' : 'Light'}
      </span>
    </button>
  );
}