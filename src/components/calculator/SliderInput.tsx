import React, { useState, useEffect } from 'react';
import { formatCurrency, formatIndianNumber } from '../../utils/format';
import { AlertCircle } from 'lucide-react';

export interface SliderInputProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  prefix?: string;
  onChange: (val: number) => void;
  onClampedChange: (val: number) => void;
  presets?: { label: string; value: number }[];
}

export const SliderInput: React.FC<SliderInputProps> = ({
  label,
  value,
  min,
  max,
  step,
  unit = '',
  prefix = '',
  onChange,
  onClampedChange,
  presets,
}) => {
  // Local state for intermediate text typing
  const [textValue, setTextValue] = useState<string>(String(value));
  const [isOutOfRange, setIsOutOfRange] = useState(false);

  useEffect(() => {
    setTextValue(String(value));
    setIsOutOfRange(false);
  }, [value]);

  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    onChange(val);
    setTextValue(String(val));
    setIsOutOfRange(false);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.]/g, '');
    setTextValue(raw);

    if (raw === '') return;

    const num = parseFloat(raw);
    if (!isNaN(num)) {
      if (num < min || num > max) {
        setIsOutOfRange(true);
      } else {
        setIsOutOfRange(false);
        onChange(num);
      }
    }
  };

  const handleBlur = () => {
    if (textValue === '' || isNaN(parseFloat(textValue))) {
      setTextValue(String(min));
      onClampedChange(min);
      setIsOutOfRange(false);
      return;
    }

    const num = parseFloat(textValue);
    if (num < min) {
      setTextValue(String(min));
      onClampedChange(min);
      setIsOutOfRange(false);
    } else if (num > max) {
      setTextValue(String(max));
      onClampedChange(max);
      setIsOutOfRange(false);
    } else {
      onClampedChange(num);
      setIsOutOfRange(false);
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
      {/* Top Header: Label & Input Box */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <label className="text-sm font-bold text-slate-800">{label}</label>
          <div className="text-xs text-slate-500 font-medium mt-0.5">
            {prefix === '₹' ? formatCurrency(value) : `${value} ${unit}`}
          </div>
        </div>

        <div className="relative flex items-center">
          {prefix && (
            <span className="absolute left-3 text-slate-400 font-bold text-sm pointer-events-none">
              {prefix}
            </span>
          )}
          <input
            type="text"
            value={textValue}
            onChange={handleTextChange}
            onBlur={handleBlur}
            className={`w-32 sm:w-36 rounded-xl border text-right pr-3.5 py-1.5 text-sm font-bold transition-all focus:outline-none focus:ring-2 ${
              prefix ? 'pl-7' : 'pl-3'
            } ${
              isOutOfRange
                ? 'border-rose-400 bg-rose-50/40 text-rose-800 focus:ring-rose-500/20'
                : 'border-slate-300 text-slate-900 focus:border-brand-500 focus:ring-brand-500/20'
            }`}
          />
          {unit && unit !== 'months' && (
            <span className="ml-2 text-xs font-semibold text-slate-500">{unit}</span>
          )}
        </div>
      </div>

      {/* Out of range error notification */}
      {isOutOfRange && (
        <p className="flex items-center gap-1.5 text-xs text-rose-600 font-medium">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>
            Value must be between {prefix}
            {prefix === '₹' ? formatIndianNumber(min) : min} and {prefix}
            {prefix === '₹' ? formatIndianNumber(max) : max}
          </span>
        </p>
      )}

      {/* Slider with dynamic track gradient following thumb */}
      <div className="relative py-1">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleSliderChange}
          style={{
            background: `linear-gradient(to right, #4F46E5 0%, #4F46E5 ${percentage}%, #E2E8F0 ${percentage}%, #E2E8F0 100%)`,
          }}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
          aria-label={label}
        />

        {/* Min / Max Labels under slider */}
        <div className="flex justify-between items-center text-xs text-slate-600 mt-1.5">
          <span>
            {prefix}
            {prefix === '₹' ? formatIndianNumber(min) : min} {unit}
          </span>
          <span>
            {prefix}
            {prefix === '₹' ? formatIndianNumber(max) : max} {unit}
          </span>
        </div>
      </div>

      {/* Preset Chips */}
      {presets && presets.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-100">
          {presets.map((preset) => (
            <button
              key={preset.value}
              type="button"
              onClick={() => {
                onChange(preset.value);
                onClampedChange(preset.value);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                value === preset.value
                  ? 'bg-brand-50 text-brand-700 border border-brand-200'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
