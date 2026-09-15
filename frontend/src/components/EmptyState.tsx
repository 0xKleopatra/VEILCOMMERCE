// VeilCommerce — Empty State Component

import { cn } from '../lib/utils';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'accent';
  };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center py-12 px-4', className)}>
      <div className="w-16 h-16 rounded-full bg-veil-100 flex items-center justify-center mb-6 text-veil-400">
        {icon || (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )}
      </div>
      <h3 className="text-lg font-semibold text-veil-900 mb-2">{title}</h3>
      {description && (
        <p className="text-veil-500 mb-6 max-w-sm mx-auto">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className={cn(
            'btn',
            action.variant === 'primary' && 'btn-primary',
            action.variant === 'secondary' && 'btn-secondary',
            action.variant === 'accent' && 'btn-accent',
            action.variant === 'primary' || 'btn-primary'
          )}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

// Pre-built empty states
export const EmptyStates = {
  noOrders: () => (
    <EmptyState
      icon={<DocumentIcon className="w-8 h-8" />}
      title="No purchase orders yet"
      description="Create your first private purchase order to start trading."
      action={{ label: 'Create Order', onClick: () => {}, variant: 'primary' }}
    />
  ),
  noEscrows: () => (
    <EmptyState
      icon={<LockIcon className="w-8 h-8" />}
      title="No active escrows"
      description="Fund an escrow when you have a confirmed purchase order."
      action={{ label: 'View Orders', onClick: () => {}, variant: 'secondary' }}
    />
  ),
  noInvoices: () => (
    <EmptyState
      icon={<ReceiptIcon className="w-8 h-8" />}
      title="No invoices"
      description="Invoices appear after delivery verification and settlement."
      action={{ label: 'View Orders', onClick: () => {}, variant: 'secondary' }}
    />
  ),
  noFinancing: () => (
    <EmptyState
      icon={<CurrencyIcon className="w-8 h-8" />}
      title="No financing opportunities"
      description="Verified invoices with delivery proof become eligible for financing."
      action={{ label: 'View Invoices', onClick: () => {}, variant: 'secondary' }}
    />
  ),
  noActivity: () => (
    <EmptyState
      icon={<ClockIcon className="w-8 h-8" />}
      title="No recent activity"
      description="Your transaction history will appear here."
    />
  ),
};

function DocumentIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
}
function LockIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
}
function ReceiptIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
}
function CurrencyIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
}
function ClockIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
}