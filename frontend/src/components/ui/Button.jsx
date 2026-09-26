import React from 'react';

export const Button = ({
  children,
  variant = 'primary', // 'primary' | 'terracotta' | 'amber' | 'jade' | 'secondary' | 'outline' | 'glass' | 'ghost' | 'danger'
  size = 'md', // 'sm' | 'md' | 'lg'
  isLoading = false,
  disabled = false,
  className = '',
  icon: Icon,
  type = 'button',
  onClick,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-150 rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none select-none cursor-pointer';

  const sizes = {
    sm: 'px-3.5 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3 text-base gap-2.5 font-semibold',
  };

  const variants = {
    primary: 'bg-gradient-to-r from-terracotta-600 via-terracotta-500 to-amber-600 text-white shadow-md shadow-terracotta-500/25 hover:shadow-terracotta-500/40 hover:brightness-105 focus:ring-terracotta-500 border border-terracotta-400/30',
    terracotta: 'bg-terracotta-500 hover:bg-terracotta-600 text-white shadow-md shadow-terracotta-500/25 hover:shadow-terracotta-500/40 focus:ring-terracotta-500 border border-terracotta-400/30',
    amber: 'bg-amber-500 hover:bg-amber-600 text-stone-950 font-semibold shadow-md shadow-amber-500/25 hover:shadow-amber-500/40 focus:ring-amber-500 border border-amber-400/30',
    jade: 'bg-jade-500 hover:bg-jade-600 text-white shadow-md shadow-jade-500/25 hover:shadow-jade-500/40 focus:ring-jade-500 border border-jade-400/30',
    secondary: 'bg-stone-100 dark:bg-ink-800 text-stone-800 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-ink-750 hover:text-stone-950 dark:hover:text-white border border-stone-300 dark:border-ink-700 focus:ring-terracotta-500 shadow-sm',
    glass: 'bg-white/80 dark:bg-ink-850/80 backdrop-blur-md text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-ink-700 hover:border-terracotta-500/40 shadow-sm focus:ring-terracotta-500',
    outline: 'bg-transparent text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-ink-700 hover:border-terracotta-500 hover:text-terracotta-600 dark:hover:text-terracotta-400 focus:ring-terracotta-500',
    ghost: 'bg-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-ink-800 focus:ring-stone-400',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500 shadow-md shadow-rose-900/30 border border-rose-500/30',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${sizes[size]} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </>
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4 shrink-0" />}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
