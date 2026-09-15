// VeilCommerce — Tabs Component

import { cn } from '../lib/utils';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  className?: string;
}

export function Tabs({
  tabs,
  activeTab,
  onChange,
  variant = 'default',
  className,
}: TabsProps) {
  const variants = {
    default: 'border-b border-veil-200',
    pills: 'bg-veil-100 rounded-lg p-1',
    underline: 'border-b border-veil-200',
  };

  return (
    <div className={cn(variants[variant], className)} role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-controls={`${tab.id}-panel`}
          id={`${tab.id}-tab`}
          onClick={() => !tab.disabled && onChange(tab.id)}
          disabled={tab.disabled}
          className={cn(
            'relative px-4 py-3 text-sm font-medium transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2',
            tab.disabled
              ? 'text-veil-400 cursor-not-allowed'
              : activeTab === tab.id
              ? variant === 'pills'
                ? 'bg-white text-accent-600 shadow-sm rounded-md'
                : variant === 'underline'
                ? 'text-accent-600 border-b-2 border-accent-600'
                : 'text-accent-600'
              : 'text-veil-500 hover:text-veil-700 hover:bg-veil-50',
            variant === 'pills' && 'rounded-md mx-1'
          )}
        >
          <div className="flex items-center gap-2">
            {tab.icon && <span className="w-5 h-5">{tab.icon}</span>}
            {tab.label}
          </div>
          {variant === 'default' && activeTab === tab.id && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-600" />
          )}
        </button>
      ))}
    </div>
  );
}

interface TabPanelProps {
  id: string;
  active: boolean;
  children: React.ReactNode;
  className?: string;
}

export function TabPanel({ id, active, children, className }: TabPanelProps) {
  if (!active) return null;
  
  return (
    <div
      id={`${id}-panel`}
      role="tabpanel"
      aria-labelledby={`${id}-tab`}
      className={cn('mt-4 animate-fade-in', className)}
    >
      {children}
    </div>
  );
}