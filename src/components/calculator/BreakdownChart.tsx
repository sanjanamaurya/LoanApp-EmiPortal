import React from 'react';
import { EmiCalculationResult } from '../../types';
import { formatCurrency } from '../../utils/format';

export interface BreakdownChartProps {
  emiResult: EmiCalculationResult;
}

export const BreakdownChart: React.FC<BreakdownChartProps> = ({ emiResult }) => {
  const { principal, totalInterest, totalAmount } = emiResult;

  const principalRatio = totalAmount > 0 ? (principal / totalAmount) * 100 : 100;
  const interestRatio = totalAmount > 0 ? (totalInterest / totalAmount) * 100 : 0;

  // SVG Donut calculation
  const size = 160;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const principalStroke = (principalRatio / 100) * circumference;
  const interestStroke = (interestRatio / 100) * circumference;

  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
      {/* SVG Donut Visual */}
      <div className="relative flex items-center justify-center shrink-0">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#F1F5F9"
            strokeWidth={strokeWidth}
          />

          {/* Principal segment (Indigo) */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#4F46E5"
            strokeWidth={strokeWidth}
            strokeDasharray={`${principalStroke} ${circumference}`}
            strokeDashoffset="0"
            className="transition-all duration-500 ease-out"
          />

          {/* Interest segment (Emerald) */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#10B981"
            strokeWidth={strokeWidth}
            strokeDasharray={`${interestStroke} ${circumference}`}
            strokeDashoffset={-principalStroke}
            className="transition-all duration-500 ease-out"
          />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Principal
          </span>
          <span className="text-lg font-black text-slate-900">
            {Math.round(principalRatio)}%
          </span>
        </div>
      </div>

      {/* Legend & Breakdown */}
      <div className="flex-1 w-full space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Payment Breakdown
        </h4>

        {/* Principal Legend */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-brand-600 shrink-0" />
            <div>
              <span className="text-xs font-bold text-slate-800">Principal Amount</span>
              <p className="text-[11px] text-slate-500">{principalRatio.toFixed(1)}% of total</p>
            </div>
          </div>
          <span className="text-xs font-extrabold text-slate-900">
            {formatCurrency(principal)}
          </span>
        </div>

        {/* Interest Legend */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-accent-500 shrink-0" />
            <div>
              <span className="text-xs font-bold text-slate-800">Total Interest</span>
              <p className="text-[11px] text-slate-500">{interestRatio.toFixed(1)}% of total</p>
            </div>
          </div>
          <span className="text-xs font-extrabold text-slate-900">
            {formatCurrency(totalInterest)}
          </span>
        </div>
      </div>
    </div>
  );
};
