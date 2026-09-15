// VeilCommerce — Dropdown Component

import { useState, useRef, useEffect } from 'react';
import { cn } from '../lib/utils';
import { ChevronDownIcon, ChevronRightIcon } from './icons';

interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

interface DropdownProps {
  label?: string;
  placeholder?: string;
  value?: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export function Dropdown({
  label,
  placeholder = 'Select...',
  value,
  options,
  onChange,
  disabled = false,
  error,
  className,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(o => o.value === value);

  return (
    <div className={cn('w-full', className)} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-veil-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            'w-full px-4 py-2.5 rounded-lg border bg-white text-left',
            'focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200',
            disabled
              ? 'bg-veil-50 text-veil-400 cursor-not-allowed border-veil-200'
              : error
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
              : 'border-veil-300 focus:ring-veil-500 focus:border-transparent hover:border-veil-400'
          )}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <div className="flex items-center justify-between">
            <span className={cn(
              'truncate',
              value ? 'text-veil-900' : 'text-veil-400'
            )}>
              {value ? selectedOption?.label : placeholder}
            </span>
            {isOpen ? <ChevronUpIcon className="w-5 h-5 text-veil-500" /> : <ChevronDownIcon className="w-5 h-5 text-veil-500" />}
          </div>
        </button>

        {isOpen && !disabled && (
          <div className="absolute z-10 mt-1 w-full bg-white rounded-lg border border-veil-200 shadow-lg max-h-60 overflow-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                disabled={option.disabled}
                className={cn(
                  'w-full px-4 py-2.5 text-left text-sm transition-colors',
                  option.disabled
                    ? 'text-veil-400 cursor-not-allowed'
                    : 'text-veil-700 hover:bg-veil-50 focus:bg-veil-50',
                  value === option.value && 'bg-accent-50 text-accent-700'
                )}
              >
                <div className="flex items-center gap-3">
                  {option.icon && <span>{option.icon}</span>}
                  <span>{option.label}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      {error && <p className="mt-1.5 text-sm text-red-600" role="alert">{error}</p>}
    </div>
  );
}

function ChevronUpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
  );
}