// VeilCommerce — Stepper Component

import { cn } from '../lib/utils';
import { CheckIcon } from './icons';

interface Step {
  key: string;
  label: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: string;
  orientation?: 'horizontal' | 'vertical';
  showNumbers?: boolean;
  className?: string;
}

export function Stepper({
  steps,
  currentStep,
  orientation = 'horizontal',
  showNumbers = true,
  className,
}: StepperProps) {
  const currentIndex = steps.findIndex(s => s.key === currentStep);

  const orientations = {
    horizontal: 'flex items-center',
    vertical: 'flex flex-col items-start gap-8',
  };

  return (
    <div className={cn(orientations[orientation], className)} role="navigation" aria-label="Progress steps">
      {steps.map((step, index) => (
        <div key={step.key} className="flex items-center">
          <div className="flex items-center">
            <div className={cn(
              'flex items-center justify-center rounded-full text-sm font-medium transition-all duration-300',
              index <= currentIndex
                ? 'bg-veil-900 text-white'
                : 'bg-veil-200 text-veil-500',
              showNumbers
                ? 'w-10 h-10'
                : 'w-8 h-8'
            )}>
              {showNumbers ? (
                index <= currentIndex ? (
                  <CheckIcon className="w-5 h-5" />
                ) : (
                  <span>{index + 1}</span>
                )
              ) : (
                index <= currentIndex ? (
                  <CheckIcon className="w-4 h-4" />
                ) : null
              )}
            </div>
            <span className={cn(
              'ml-3 text-sm font-medium hidden sm:block',
              index <= currentIndex ? 'text-veil-900' : 'text-veil-500'
            )}>
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className={cn(
              'flex-1 h-0.5 rounded transition-colors duration-300',
              orientation === 'horizontal' ? 'mx-4' : 'w-full',
              index < currentIndex ? 'bg-veil-900' : 'bg-veil-200'
            )} />
          )}
        </div>
      ))}
    </div>
  );
}