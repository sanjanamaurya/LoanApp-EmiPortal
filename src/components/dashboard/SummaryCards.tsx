import React from 'react';
import { Application, ApplicationStatus } from '../../types';
import { Clock, Eye, CheckCircle2, XCircle, FileSpreadsheet } from 'lucide-react';

export interface SummaryCardsProps {
  applications: Application[];
  selectedStatus: 'All' | ApplicationStatus;
  onSelectStatus: (status: 'All' | ApplicationStatus) => void;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  applications,
  selectedStatus,
  onSelectStatus,
}) => {
  const total = applications.length;
  const pending = applications.filter((a) => a.status === 'Pending').length;
  const underReview = applications.filter((a) => a.status === 'Under Review').length;
  const approved = applications.filter((a) => a.status === 'Approved').length;
  const rejected = applications.filter((a) => a.status === 'Rejected').length;

  const cards: {
    status: 'All' | ApplicationStatus;
    label: string;
    count: number;
    icon: React.ReactNode;
    colorClasses: string;
    activeBorder: string;
  }[] = [
    {
      status: 'All',
      label: 'Total Applications',
      count: total,
      icon: <FileSpreadsheet className="w-5 h-5 text-slate-700" />,
      colorClasses: 'bg-white text-slate-900',
      activeBorder: 'border-slate-800 ring-2 ring-slate-800/10',
    },
    {
      status: 'Pending',
      label: 'Pending',
      count: pending,
      icon: <Clock className="w-5 h-5 text-amber-600" />,
      colorClasses: 'bg-white text-amber-700',
      activeBorder: 'border-amber-500 ring-2 ring-amber-500/20',
    },
    {
      status: 'Under Review',
      label: 'Under Review',
      count: underReview,
      icon: <Eye className="w-5 h-5 text-blue-600" />,
      colorClasses: 'bg-white text-blue-700',
      activeBorder: 'border-blue-500 ring-2 ring-blue-500/20',
    },
    {
      status: 'Approved',
      label: 'Approved',
      count: approved,
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      colorClasses: 'bg-white text-emerald-700',
      activeBorder: 'border-emerald-500 ring-2 ring-emerald-500/20',
    },
    {
      status: 'Rejected',
      label: 'Rejected',
      count: rejected,
      icon: <XCircle className="w-5 h-5 text-rose-600" />,
      colorClasses: 'bg-white text-rose-700',
      activeBorder: 'border-rose-500 ring-2 ring-rose-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
      {cards.map((card) => {
        const isSelected = selectedStatus === card.status;

        return (
          <button
            key={card.status}
            type="button"
            onClick={() => onSelectStatus(card.status)}
            className={`p-4 rounded-2xl border text-left transition-all duration-200 select-none shadow-sm hover:shadow-card hover:-translate-y-0.5 ${
              card.colorClasses
            } ${isSelected ? card.activeBorder : 'border-slate-200 hover:border-slate-300'}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">{card.label}</span>
              <div className="p-1.5 rounded-xl bg-slate-50">{card.icon}</div>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">{card.count}</div>
          </button>
        );
      })}
    </div>
  );
};
