'use client';

import { clsx } from 'clsx';
import { Check } from 'lucide-react';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  completedSteps: number;
  stepLabels?: string[];
}

export function ProgressIndicator({
  currentStep,
  totalSteps,
  completedSteps,
  stepLabels,
}: ProgressIndicatorProps) {
  return (
    <div className="flex items-center justify-center">
      {Array.from({ length: totalSteps }, (_, i) => {
        const stepNumber = i + 1;
        const isCompleted = stepNumber <= completedSteps;
        const isCurrent = stepNumber === currentStep;
        const label = stepLabels?.[i];

        return (
          <div key={stepNumber} className="flex items-center">
            {/* Step with label */}
            <div className="flex flex-col items-center">
              {/* Step circle */}
              <div
                className={clsx(
                  'w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300',
                  {
                    'bg-emerald-500 text-white': isCompleted,
                    'bg-slate-800 text-white ring-4 ring-slate-200': isCurrent && !isCompleted,
                    'bg-slate-200 text-slate-500': !isCompleted && !isCurrent,
                  }
                )}
              >
                {isCompleted ? <Check size={20} strokeWidth={3} /> : stepNumber}
              </div>

              {/* Label */}
              {label && (
                <span
                  className={clsx('text-xs mt-2 font-medium', {
                    'text-emerald-600': isCompleted,
                    'text-slate-800': isCurrent && !isCompleted,
                    'text-slate-400': !isCompleted && !isCurrent,
                  })}
                >
                  {label}
                </span>
              )}
            </div>

            {/* Connector line */}
            {stepNumber < totalSteps && (
              <div
                className={clsx('w-16 h-1 mx-2 rounded-full transition-all duration-300', {
                  'bg-emerald-500': stepNumber < completedSteps,
                  'bg-slate-200': stepNumber >= completedSteps,
                })}
                style={{ marginTop: label ? '-1.5rem' : 0 }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
