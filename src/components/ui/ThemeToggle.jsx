import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className="flex items-center gap-2 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
    >
      {theme === 'dark' ? (
        <Moon className="h-4 w-4 text-slate-500 dark:text-slate-300" />
      ) : (
        <Sun className="h-4 w-4 text-slate-500 dark:text-slate-300" />
      )}
      <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
        {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
      </span>
    </button>
  );
}