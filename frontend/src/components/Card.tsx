// VeilCommerce — Card Component

import { cn } from '../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export function Card({
  variant = 'default',
  padding = 'md',
  hover = false,
  className,
  children,
  ...props
}: CardProps) {
  const variants = {
    default: 'bg-white border border-veil-200 shadow-sm',
    bordered: 'bg-white border-2 border-veil-200',
    elevated: 'bg-white border border-veil-200 shadow-lg',
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={cn(
        'rounded-xl transition-all duration-200',
        variants[variant],
        paddings[padding],
        hover && 'hover:shadow-md hover:border-veil-300 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}