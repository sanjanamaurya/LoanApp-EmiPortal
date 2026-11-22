import React from 'react';
import { EmiCalculationResult } from '../../types';
import { formatCurrency } from '../../utils/format';
import { Button } from '../ui/Button';
import { ArrowRight, Sparkles, WalletCards, Coins } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface EmiResultsProps {
  amount: number;
  rate: number;
  tenure: number;
  emiResult: EmiCalculationResult;
}

export const EmiResults: React.FC<EmiResultsProps> = ({
  amount,
  rate,
  tenure,
  emiResult,
}) => {
  const navigate = useNavigate();

  const handleApplyClick = () => {
    // Navigate to /apply carrying chosen amount, rate, tenure
    navigate(`/apply?amount=${amount}&rate=${rate}&tenure=${tenure}`);
  };

  return (
    <div className="space-y-4">
      {/* Featured EMI Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-900 via-brand-800 to-slate-900 p-6 sm:p-7 text-white shadow-xl shadow-brand-950/20">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-36 h-36 bg-brand-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-36 h-36 bg-accent-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col justify-between h-full">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-brand-200 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-accent-400" />
              <span>Calculated Monthly Installment</span>
            </div>

            <p className="text-xs uppercase tracking-wider text-slate-300 font-bold">
              Your Monthly EMI
            </p>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mt-1">
              {formatCurrency(emiResult.monthlyEmi)}
              <span className="text-sm font-semibold text-brand-200 ml-1.5">/ month</span>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="text-xs text-slate-300">
              For <span className="text-white font-semibold">{tenure} months</span> at{' '}
              <span className="text-white font-semibold">{rate}% p.a.</span>
            </div>

            <Button
              variant="success"
              size="md"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={handleApplyClick}
              className="shadow-lg shadow-emerald-900/30 font-bold"
            >
              Apply for this Loan
            </Button>
          </div>
        </div>
      </div>

      {/* Breakdown Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-600">Total Interest Payable</span>
            <p className="text-lg font-black text-slate-900 tracking-tight">
              {formatCurrency(emiResult.totalInterest)}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-accent-50 text-accent-700 flex items-center justify-center shrink-0">
            <WalletCards className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-600">Total Amount Payable</span>
            <p className="text-lg font-black text-slate-900 tracking-tight">
              {formatCurrency(emiResult.totalAmount)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
