import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle = ({ className = '', size = 'md' }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle Theme"
      className={`relative inline-flex items-center justify-center rounded-2xl transition-all duration-300 border focus:outline-none focus:ring-2 focus:ring-terracotta-500/40 active:scale-95 cursor-pointer select-none ${
        size === 'sm' ? 'p-1.5 text-xs' : 'p-2 text-sm'
      } ${
        isDark
          ? 'bg-ink-850/90 border-ink-700/80 text-amber-300 hover:text-amber-200 hover:bg-ink-800 shadow-sm'
          : 'bg-parchment-light border-stone-300/80 text-terracotta-600 hover:text-terracotta-700 hover:bg-stone-100 shadow-sm'
      } ${className}`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 rotate-0 scale-100 hover:rotate-45" />
        ) : (
          <Moon className="w-4 h-4 text-terracotta-600 transition-transform duration-300 -rotate-12 scale-100" />
        )}
      </div>
      <span className="sr-only">Toggle theme</span>
    </button>
  );
};

export default ThemeToggle;
