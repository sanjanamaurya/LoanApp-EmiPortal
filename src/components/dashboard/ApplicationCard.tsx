import React from 'react';
import { Application } from '../../types';
import { formatCurrency, formatShortDate } from '../../utils/format';
import { Badge } from '../ui/Badge';
import { PanCell } from './PanCell';
import { ChevronRight } from 'lucide-react';

export interface ApplicationCardProps {
  application: Application;
  onClick: () => void;
  globalShowPan: boolean;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  onClick,
  globalShowPan,
}) => {
  const { id, applicant, loan, status, createdAt } = application;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-brand-300 hover:shadow-card transition-all cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-brand-500"
    >
      <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
        <div>
          <span className="font-mono text-xs font-black text-brand-700">{id}</span>
          <h4 className="text-sm font-bold text-slate-900 mt-0.5">{applicant.fullName}</h4>
        </div>
        <Badge status={status} size="sm" />
      </div>

      <div className="grid grid-cols-2 gap-3 py-3 text-xs">
        <div>
          <span className="text-slate-400 block text-[11px]">Loan Amount</span>
          <span className="text-sm font-extrabold text-slate-900">
            {formatCurrency(loan.amount)}
          </span>
        </div>

        <div>
          <span className="text-slate-400 block text-[11px]">Monthly EMI</span>
          <span className="text-sm font-extrabold text-brand-600">
            {formatCurrency(loan.monthlyEmi)}/mo
          </span>
        </div>

        <div>
          <span className="text-slate-400 block text-[11px]">PAN</span>
          <PanCell pan={applicant.pan} globalShowPan={globalShowPan} />
        </div>

        <div>
          <span className="text-slate-400 block text-[11px]">Date</span>
          <span className="font-medium text-slate-700">{formatShortDate(createdAt)}</span>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-brand-600 font-bold">
        <span>View Full Details & Status</span>
        <ChevronRight className="w-4 h-4" />
      </div>
    </div>
  );
};
