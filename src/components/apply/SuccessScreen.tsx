import React, { useState } from 'react';
import { Application } from '../../types';
import { formatCurrency, formatDate } from '../../utils/format';
import { Button } from '../ui/Button';
import { CheckCircle2, Copy, Check, LayoutDashboard, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface SuccessScreenProps {
  application: Application;
  onApplyAgain: () => void;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({
  application,
  onApplyAgain,
}) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(application.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-xl mx-auto py-8 text-center space-y-6 animate-scale-up">
      {/* Animated Check Icon */}
      <div className="w-20 h-20 rounded-3xl bg-accent-50 text-accent-600 flex items-center justify-center mx-auto shadow-glow-accent">
        <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
      </div>

      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Application Submitted Successfully!
        </h2>
        <p className="text-sm text-slate-500 mt-1.5">
          Your loan application is now in review with our automated credit assessment engine.
        </p>
      </div>

      {/* ID Badge with copy */}
      <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <span className="text-xs font-semibold text-slate-500">Application Reference ID:</span>
        <span className="text-base font-black text-slate-900 font-mono">{application.id}</span>
        <button
          type="button"
          onClick={handleCopyId}
          className="p-1.5 text-slate-400 hover:text-brand-600 rounded-lg hover:bg-brand-50 transition-colors"
          title="Copy Reference ID"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>

      {/* Summary Card */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 text-left space-y-4 shadow-sm">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Application Summary
        </h4>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-slate-500 block">Applicant Name</span>
            <span className="text-sm font-bold text-slate-900">{application.applicant.fullName}</span>
          </div>

          <div>
            <span className="text-slate-500 block">Initial Status</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 font-bold border border-amber-200 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              {application.status}
            </span>
          </div>

          <div>
            <span className="text-slate-500 block">Loan Amount</span>
            <span className="text-sm font-extrabold text-slate-900">
              {formatCurrency(application.loan.amount)}
            </span>
          </div>

          <div>
            <span className="text-slate-500 block">Monthly EMI</span>
            <span className="text-sm font-extrabold text-brand-600">
              {formatCurrency(application.loan.monthlyEmi)}/mo
            </span>
          </div>

          <div className="col-span-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
            Submitted on {formatDate(application.createdAt)}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Button
          variant="primary"
          size="md"
          leftIcon={<LayoutDashboard className="w-4 h-4" />}
          onClick={() => navigate('/dashboard')}
          className="w-full sm:w-auto"
        >
          Go to Dashboard
        </Button>

        <Button
          variant="outline"
          size="md"
          leftIcon={<RefreshCw className="w-4 h-4" />}
          onClick={onApplyAgain}
          className="w-full sm:w-auto"
        >
          Apply for Another Loan
        </Button>
      </div>
    </div>
  );
};
