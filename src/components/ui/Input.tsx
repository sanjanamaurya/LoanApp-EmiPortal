import React from 'react';
import { AlertCircle } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftPrefix?: React.ReactNode;
  rightSuffix?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftPrefix, rightSuffix, id, className = '', ...props }, ref) => {
    const inputId = id || props.name || Math.random().toString(36).substring(2, 9);
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold text-slate-700 tracking-wide">
            {label} {props.required && <span className="text-rose-500">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {leftPrefix && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-500 text-sm">
              {leftPrefix}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : hint ? hintId : undefined}
            className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 ${
              leftPrefix ? 'pl-11' : ''
            } ${rightSuffix ? 'pr-11' : ''} ${
              error
                ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                : 'border-slate-300 hover:border-slate-400 focus:border-brand-500'
            } ${className}`}
            {...props}
          />

          {rightSuffix && (
            <div className="absolute right-3.5 flex items-center pointer-events-none text-slate-500 text-sm">
              {rightSuffix}
            </div>
          )}
        </div>

        {error ? (
          <p id={errorId} className="flex items-center gap-1.5 text-xs text-rose-600 font-medium">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </p>
        ) : hint ? (
          <p id={hintId} className="text-xs text-slate-500">
            {hint}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
