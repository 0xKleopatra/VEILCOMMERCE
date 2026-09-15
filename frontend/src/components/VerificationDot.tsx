// VeilCommerce — Verification Dot Component

import { cn } from '../lib/utils';
import { CheckIcon } from './icons';

interface VerificationDotProps {
  label: string;
  verified: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
  tooltip?: string;
}

export function VerificationDot({
  label,
  verified,
  size = 'md',
  showLabel = true,
  className,
  tooltip,
}: VerificationDotProps) {
  const sizes = {
    sm: { dot: 'w-1.5 h-1.5', icon: 'w-3 h-3', label: 'text-xs', gap: 'gap-1' },
    md: { dot: 'w-2 h-2', icon: 'w-4 h-4', label: 'text-sm', gap: 'gap-1.5' },
    lg: { dot: 'w-3 h-3', icon: 'w-5 h-5', label: 'text-base', gap: 'gap-2' },
  };

  const config = sizes[size];

  const content = (
    <div className={cn('flex items-center', config.gap, className)} title={tooltip}>
      {verified ? (
        <CheckIcon className={cn(config.icon, 'text-green-500', 'flex-shrink-0')} />
      ) : (
        <span className={cn(config.dot, 'rounded-full bg-red-500', 'flex-shrink-0')} />
      )}
      {showLabel && (
        <span className={cn(config.label, 'font-medium', verified ? 'text-veil-700' : 'text-veil-600')}>
          {label}
        </span>
      )}
    </div>
  );

  return tooltip ? (
    <div className="relative inline-block" title={tooltip}>
      {content}
    </div>
  ) : content;
}

interface VerificationBadgeProps {
  label: string;
  status: 'verified' | 'pending' | 'failed' | 'expired';
  size?: 'sm' | 'md';
  className?: string;
}

export function VerificationBadge({
  label,
  status,
  size = 'md',
  className,
}: VerificationBadgeProps) {
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
  };

  const statusConfig = {
    verified: { color: 'bg-green-100 text-green-800', icon: 'text-green-600' },
    pending: { color: 'bg-yellow-100 text-yellow-800', icon: 'text-yellow-600' },
    failed: { color: 'bg-red-100 text-red-800', icon: 'text-red-600' },
    expired: { color: 'bg-veil-100 text-veil-600', icon: 'text-veil-500' },
  };

  const config = statusConfig[status];

  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full font-medium', sizes[size], config.color, className)}>
      <span className={cn('w-1.5 h-1.5 rounded-full', status === 'verified' && 'bg-green-500', status === 'pending' && 'bg-yellow-500', status === 'failed' && 'bg-red-500', status === 'expired' && 'bg-veil-400')} />
      <span>{label}</span>
    </span>
  );
}

interface VerificationRowProps {
  label: string;
  verified: boolean;
  onVerify?: () => void;
  description?: string;
  verifying?: boolean;
  className?: string;
}

export function VerificationRow({
  label,
  verified,
  onVerify,
  description,
  verifying = false,
  className,
}: VerificationRowProps) {
  return (
    <div className={cn('p-4 rounded-lg border border-veil-200 bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4', className)}>
      <div className="flex items-center gap-4">
        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', verified ? 'bg-green-100' : 'bg-veil-100')}>
          {verified ? (
            <CheckIcon className="w-5 h-5 text-green-600" />
          ) : (
            <span className="w-5 h-5 rounded border-2 border-veil-300" />
          )}
        </div>
        <div>
          <p className="font-medium text-veil-900">{label}</p>
          {description && <p className="text-xs text-veil-500">{description}</p>}
        </div>
      </div>
      <div className="flex items-center gap-3">
        {verified && <span className="text-sm text-green-600 font-medium">Verified ✓</span>}
        {!verified && onVerify && (
          <button
            onClick={onVerify}
            disabled={verifying}
            className={cn('btn-secondary whitespace-nowrap', verifying && 'opacity-50 cursor-wait')}
          >
            {verifying ? 'Verifying...' : 'Verify'}
          </button>
        )}
      </div>
    </div>
  );
}