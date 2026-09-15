// VeilCommerce — Loading Spinner Component

import { cn } from '../lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white' | 'accent';
  className?: string;
  text?: string;
}

export function LoadingSpinner({
  size = 'md',
  color = 'primary',
  className,
  text,
}: LoadingSpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  const colors = {
    primary: 'border-veil-900 border-t-transparent',
    white: 'border-white border-t-transparent',
    accent: 'border-accent-600 border-t-transparent',
  };

  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      <svg
        className={cn('animate-spin', sizes[size], colors[color])}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="status"
        aria-label="Loading"
      >
        <circle cx="12" cy="12" r="10" strokeWidth="3" />
      </svg>
      {text && <span className="text-sm text-veil-500">{text}</span>}
    </div>
  );
}

interface LoadingOverlayProps {
  isVisible: boolean;
  text?: string;
}

export function LoadingOverlay({ isVisible, text }: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
}

export function LoadingButton({ loading = false, children, ...props }: { loading?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      disabled={loading || props.disabled}
      className="relative inline-flex items-center justify-center"
      {...props}
    >
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner size="sm" color="white" />
        </span>
      )}
      <span className={cn('relative', loading ? 'invisible' : 'visible')}>
        {children}
      </span>
    </button>
  );
}