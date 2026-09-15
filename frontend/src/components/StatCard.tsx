// VeilCommerce — Stat Card Component

import { cn } from '../lib/utils';

interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  changeColor?: 'green' | 'red' | 'yellow';
  icon: React.ReactNode;
  iconColor?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  change,
  changeColor = 'green',
  icon,
  iconColor = 'text-veil-600',
  className,
}: StatCardProps) {
  const changeColors = {
    green: 'text-green-600',
    red: 'text-red-600',
    yellow: 'text-yellow-600',
  };

  return (
    <div className={cn('card p-6', className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-veil-500">{label}</p>
          <p className="text-3xl font-bold text-veil-900 mt-2">{value}</p>
          {change && (
            <p className={cn('text-sm font-medium mt-2', changeColors[changeColor])}>
              {change} vs last month
            </p>
          )}
        </div>
        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', iconColor)}>
          {icon}
        </div>
      </div>
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
  color?: string;
  className?: string;
}

export function MetricCard({
  label,
  value,
  color = 'text-veil-900',
  className,
}: MetricCardProps) {
  return (
    <div className={cn('p-3 rounded-lg bg-veil-50', className)}>
      <p className="text-xs text-veil-500">{label}</p>
      <p className={cn('font-bold', color)}>{value}</p>
    </div>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
}

export function FeatureCard({
  title,
  description,
  icon,
  className,
}: FeatureCardProps) {
  return (
    <div className={cn('p-4 rounded-lg bg-veil-50', className)}>
      <div className="w-10 h-10 rounded-lg bg-veil-100 text-accent-600 flex items-center justify-center mb-3">
        {icon}
      </div>
      <h3 className="font-medium text-veil-900">{title}</h3>
      <p className="text-sm text-veil-600 mt-1">{description}</p>
    </div>
  );
}