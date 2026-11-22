import React from 'react';
import { EligibilityResult } from '../../types';
import { formatCurrency } from '../../utils/format';
import { CheckCircle2, AlertTriangle, Info, ArrowDownRight } from 'lucide-react';
import { EMPLOYMENT_LIMITS } from '../../constants';

export interface EligibilityCardProps {
  eligibility: EligibilityResult;
  onApplySuggestedAmount?: (amount: number) => void;
}

export const EligibilityCard: React.FC<EligibilityCardProps> = ({
  eligibility,
  onApplySuggestedAmount,
}) => {
  const {
    monthlyIncome,
    newEmi,
    existingEmis,
    totalObligations,
    ratio,
    isEligible,
    maxEligibleLoanAmount,
  } = eligibility;

  // Visual meter color: < 40% emerald, 40-50% amber, > 50% rose
  const meterColor =
    ratio <= EMPLOYMENT_LIMITS.SAFE_FOIR_RATIO
      ? 'bg-emerald-500'
      : ratio <= EMPLOYMENT_LIMITS.MAX_FOIR_RATIO
      ? 'bg-amber-500'
      : 'bg-rose-500';

  const clampedMeterWidth = Math.min(100, Math.max(0, ratio));

  return (
    <div
      className={`rounded-2xl border p-5 transition-all duration-300 ${
        isEligible
          ? 'bg-gradient-to-br from-emerald-50/70 to-teal-50/30 border-emerald-200'
          : 'bg-gradient-to-br from-rose-50/70 to-amber-50/30 border-rose-200'
      }`}
    >
      {/* Header status */}
      <div className="flex items-start gap-3.5">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            isEligible ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
          }`}
        >
          {isEligible ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4
              className={`text-sm font-bold ${
                isEligible ? 'text-emerald-950' : 'text-rose-950'
              }`}
            >
              {isEligible ? 'You Look Eligible!' : 'High EMI Obligation Warning'}
            </h4>
            <span
              className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                isEligible
                  ? 'bg-emerald-200/80 text-emerald-900'
                  : 'bg-rose-200/80 text-rose-900'
              }`}
            >
              FOIR: {ratio}%
            </span>
          </div>

          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            {isEligible
              ? `Your total monthly debt obligations represent ${ratio}% of your income, comfortably within the 50% prudent borrowing threshold.`
              : `Your total EMI obligation (${formatCurrency(totalObligations)}) is ${ratio}% of your monthly income, above the 50% standard limit.`}
          </p>
        </div>
      </div>

      {/* Progress Bar Meter */}
      <div className="mt-4 pt-3 border-t border-slate-200/60">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 font-medium">
          <span>Debt-to-Income Meter</span>
          <span>Max Allowed: 50%</span>
        </div>
        <div className="h-2 w-full bg-slate-200/80 rounded-full overflow-hidden">
          <div
            className={`h-full ${meterColor} transition-all duration-300 ease-out`}
            style={{ width: `${clampedMeterWidth}%` }}
          />
        </div>
      </div>

      {/* Breakdown Metrics */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-200/60 text-xs">
        <div className="bg-white/80 rounded-xl p-2.5 border border-slate-100">
          <span className="text-slate-400 font-semibold block text-[11px]">Monthly Income</span>
          <span className="font-bold text-slate-900">{formatCurrency(monthlyIncome)}</span>
        </div>
        <div className="bg-white/80 rounded-xl p-2.5 border border-slate-100">
          <span className="text-slate-400 font-semibold block text-[11px]">New Loan EMI</span>
          <span className="font-bold text-brand-600">{formatCurrency(newEmi)}</span>
        </div>
        <div className="bg-white/80 rounded-xl p-2.5 border border-slate-100">
          <span className="text-slate-400 font-semibold block text-[11px]">Existing EMIs</span>
          <span className="font-bold text-slate-700">{formatCurrency(existingEmis)}</span>
        </div>
        <div className="bg-white/80 rounded-xl p-2.5 border border-slate-100">
          <span className="text-slate-400 font-semibold block text-[11px]">Total Obligations</span>
          <span className="font-bold text-slate-900">{formatCurrency(totalObligations)}</span>
        </div>
      </div>

      {/* Concrete Suggestion if Over Limit */}
      {!isEligible && maxEligibleLoanAmount > 0 && onApplySuggestedAmount && (
        <div className="mt-4 p-3 rounded-xl bg-white border border-rose-200/80 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <Info className="w-4 h-4 text-brand-600 shrink-0" />
            <span>
              Recommended safe loan amount to stay ≤ 50%: <strong>{formatCurrency(maxEligibleLoanAmount)}</strong>
            </span>
          </div>

          <button
            type="button"
            onClick={() => onApplySuggestedAmount(maxEligibleLoanAmount)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold shrink-0 transition-colors"
          >
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>Apply {formatCurrency(maxEligibleLoanAmount)}</span>
          </button>
        </div>
      )}
    </div>
  );
};
