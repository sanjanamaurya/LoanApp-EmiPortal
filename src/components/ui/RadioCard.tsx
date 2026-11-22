import React from 'react';

export interface RadioCardOption<T extends string> {
  value: T;
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export interface RadioCardProps<T extends string> {
  name: string;
  options: RadioCardOption<T>[];
  value: T;
  onChange: (val: T) => void;
  label?: string;
  error?: string;
}

export function RadioCard<T extends string>({
  name,
  options,
  value,
  onChange,
  label,
  error,
}: RadioCardProps<T>) {
  return (
    <div className="w-full flex flex-col gap-2">
      {label && (
        <span className="text-xs font-semibold text-slate-700 tracking-wide">
          {label} <span className="text-rose-500">*</span>
        </span>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <label
              key={opt.value}
              className={`relative flex items-start gap-3.5 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 select-none ${
                isSelected
                  ? 'border-brand-600 bg-brand-50/40 text-slate-900 shadow-sm ring-1 ring-brand-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={isSelected}
                onChange={() => onChange(opt.value)}
                className="sr-only"
              />

              <div
                className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                  isSelected ? 'border-brand-600 bg-brand-600' : 'border-slate-300 bg-white'
                }`}
              >
                {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {opt.icon && (
                    <span className={isSelected ? 'text-brand-600' : 'text-slate-500'}>
                      {opt.icon}
                    </span>
                  )}
                  <span className="text-sm font-semibold text-slate-900">{opt.title}</span>
                </div>
                {opt.description && (
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    {opt.description}
                  </p>
                )}
              </div>
            </label>
          );
        })}
      </div>

      {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
    </div>
  );
}
