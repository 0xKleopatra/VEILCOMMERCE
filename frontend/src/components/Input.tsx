// VeilCommerce — Input Component

import { cn } from '../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id || `input-${Math.random().toString(36).slice(2, 9)}`;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-veil-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-veil-400">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          className={cn(
            'w-full px-4 py-2.5 rounded-lg border bg-white text-veil-900 placeholder-veil-400',
            'focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200',
            leftIcon ? 'pl-10' : '',
            rightIcon ? 'pr-10' : '',
            error
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
              : 'border-veil-300 focus:ring-veil-500 focus:border-transparent',
            'disabled:bg-veil-50 disabled:text-veil-400 disabled:cursor-not-allowed',
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-veil-400">
            {rightIcon}
          </div>
        )}
        {error && (
          <div className="absolute -bottom-5 left-0 text-xs text-red-600" role="alert">
            {error}
          </div>
        )}
      </div>
      {helperText && !error && (
        <p className="mt-1.5 text-xs text-veil-500">{helperText}</p>
      )}
    </div>
  );
}