import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export function Card({
  children,
  className = '',
  padding = 'md',
  hover = false,
}: CardProps) {
  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={`bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm ${paddings[padding]} ${
        hover
          ? 'hover:shadow-md hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-200'
          : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
