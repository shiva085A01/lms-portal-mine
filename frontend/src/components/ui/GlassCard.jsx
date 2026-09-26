import React from 'react';

export const GlassCard = ({
  children,
  className = '',
  hoverEffect = true,
  onClick,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-3xl bg-white dark:bg-ink-850 border border-stone-200 dark:border-ink-750 text-stone-900 dark:text-parchment-100 p-6 shadow-sm ${
        hoverEffect ? 'hover:-translate-y-0.5 hover:border-terracotta-500/40 hover:shadow-md transition-all duration-200' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
