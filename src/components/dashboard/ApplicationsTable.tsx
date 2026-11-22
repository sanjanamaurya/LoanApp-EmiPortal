import React from 'react';
import { Application, SortOption } from '../../types';
import { formatCurrency, formatShortDate } from '../../utils/format';
import { Badge } from '../ui/Badge';
import { PanCell } from './PanCell';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

export interface ApplicationsTableProps {
  applications: Application[];
  onSelectApplication: (app: Application) => void;
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
  globalShowPan: boolean;
}

export const ApplicationsTable: React.FC<ApplicationsTableProps> = ({
  applications,
  onSelectApplication,
  currentSort,
  onSortChange,
  globalShowPan,
}) => {
  const handleAmountSortToggle = () => {
    if (currentSort === 'amount_desc') {
      onSortChange('amount_asc');
    } else {
      onSortChange('amount_desc');
    }
  };

  const handleDateSortToggle = () => {
    if (currentSort === 'date_desc') {
      onSortChange('date_asc');
    } else {
      onSortChange('date_desc');
    }
  };

  return (
    <div className="overflow-x-auto rounded-2xl bg-white border border-slate-200 shadow-sm">
      <table className="w-full text-left border-collapse text-xs">
        <thead className="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200">
          <tr>
            <th className="py-3.5 px-4">Application ID</th>
            <th className="py-3.5 px-4">Applicant</th>
            <th className="py-3.5 px-4">PAN Number</th>
            <th className="py-3.5 px-4 cursor-pointer hover:bg-slate-200/80 transition-colors" onClick={handleAmountSortToggle}>
              <div className="flex items-center gap-1.5">
                <span>Loan Amount</span>
                {currentSort === 'amount_desc' ? (
                  <ArrowDown className="w-3.5 h-3.5 text-brand-600" />
                ) : currentSort === 'amount_asc' ? (
                  <ArrowUp className="w-3.5 h-3.5 text-brand-600" />
                ) : (
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                )}
              </div>
            </th>
            <th className="py-3.5 px-4">Tenure</th>
            <th className="py-3.5 px-4">Monthly EMI</th>
            <th className="py-3.5 px-4">Status</th>
            <th className="py-3.5 px-4 cursor-pointer hover:bg-slate-200/80 transition-colors" onClick={handleDateSortToggle}>
              <div className="flex items-center gap-1.5">
                <span>Applied Date</span>
                {currentSort === 'date_desc' ? (
                  <ArrowDown className="w-3.5 h-3.5 text-brand-600" />
                ) : currentSort === 'date_asc' ? (
                  <ArrowUp className="w-3.5 h-3.5 text-brand-600" />
                ) : (
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                )}
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {applications.map((app) => (
            <tr
              key={app.id}
              tabIndex={0}
              role="button"
              onClick={() => onSelectApplication(app)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectApplication(app);
                }
              }}
              className="hover:bg-slate-50/80 transition-colors cursor-pointer focus:outline-none focus:bg-brand-50/30"
            >
              <td className="py-3.5 px-4 font-mono font-bold text-brand-700">
                {app.id}
              </td>
              <td className="py-3.5 px-4">
                <span className="font-bold text-slate-900 block">{app.applicant.fullName}</span>
                <span className="text-[11px] text-slate-500 block truncate">{app.applicant.email}</span>
              </td>
              <td className="py-3.5 px-4">
                <PanCell pan={app.applicant.pan} globalShowPan={globalShowPan} />
              </td>
              <td className="py-3.5 px-4 font-extrabold text-slate-900">
                {formatCurrency(app.loan.amount)}
              </td>
              <td className="py-3.5 px-4 font-medium text-slate-600">
                {app.loan.tenure} mos
              </td>
              <td className="py-3.5 px-4 font-extrabold text-brand-600">
                {formatCurrency(app.loan.monthlyEmi)}
              </td>
              <td className="py-3.5 px-4">
                <Badge status={app.status} size="sm" />
              </td>
              <td className="py-3.5 px-4 text-slate-500 font-medium">
                {formatShortDate(app.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
