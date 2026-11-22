import React from 'react';
import { Check } from 'lucide-react';

export interface StepItem {
  id: number;
  label: string;
  description?: string;
}

export interface StepperProps {
  steps: StepItem[];
  currentStep: number;
  completedSteps: number[];
  onStepClick?: (step: number) => void;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  completedSteps,
  onStepClick,
}) => {
  const progressPercent = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="w-full">
      {/* Progress Bar Track */}
      <div className="relative mb-6">
        <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-600 transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Steps List */}
      <div className="flex items-center justify-between">
        {steps.map((step) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = currentStep === step.id;
          const isAccessible = isCompleted || step.id <= currentStep;

          return (
            <button
              key={step.id}
              type="button"
              disabled={!isAccessible}
              onClick={() => isAccessible && onStepClick?.(step.id)}
              className={`flex items-center gap-3 text-left group transition-opacity ${
                !isAccessible ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-200 ${
                  isCompleted
                    ? 'bg-accent-600 text-white shadow-sm'
                    : isCurrent
                    ? 'bg-brand-600 text-white shadow-glow-brand ring-4 ring-brand-100'
                    : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5 stroke-[2.5]" /> : step.id}
              </div>

              <div className="hidden sm:block">
                <p
                  className={`text-xs font-bold leading-tight ${
                    isCurrent
                      ? 'text-brand-600'
                      : isCompleted
                      ? 'text-slate-800'
                      : 'text-slate-500'
                  }`}
                >
                  Step {step.id}
                </p>
                <p className="text-xs font-semibold text-slate-700">{step.label}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
