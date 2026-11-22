import React, { useState } from 'react';
import { AmortizationRow } from '../../types';
import { formatCurrency } from '../../utils/format';
import { ChevronDown, ChevronUp, Calendar } from 'lucide-react';

export interface AmortizationTableProps {
  schedule: AmortizationRow[];
}

export const AmortizationTable: React.FC<AmortizationTableProps> = ({ schedule }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Totals calculations
  const totalPrincipal = schedule.reduce((acc, row) => acc + row.principal, 0);
  const totalInterest = schedule.reduce((acc, row) => acc + row.interest, 0);
  const totalEmi = schedule.reduce((acc, row) => acc + row.emi, 0);

  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden transition-all">
      {/* Accordion Toggle Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors text-left"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Amortization Schedule ({schedule.length} Months)
            </h3>
            <p className="text-xs text-slate-500">
              Month-wise breakdown of Principal, Interest, and Remaining Balance
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-brand-600">
          <span>{isOpen ? 'Hide Schedule' : 'View Schedule'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Collapsible Table Content */}
      {isOpen && (
        <div className="border-t border-slate-200">
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="sticky top-0 bg-slate-100/95 backdrop-blur-sm z-10 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Month</th>
                  <th className="py-3 px-4">Opening Balance</th>
                  <th className="py-3 px-4">Monthly EMI</th>
                  <th className="py-3 px-4">Principal Paid</th>
                  <th className="py-3 px-4">Interest Paid</th>
                  <th className="py-3 px-4 text-right">Remaining Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {schedule.map((row) => (
                  <tr key={row.month} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-4 font-bold text-slate-900">M{row.month}</td>
                    <td className="py-2.5 px-4 text-slate-600">{formatCurrency(row.openingBalance)}</td>
                    <td className="py-2.5 px-4 font-semibold text-slate-900">{formatCurrency(row.emi)}</td>
                    <td className="py-2.5 px-4 text-brand-600 font-semibold">{formatCurrency(row.principal)}</td>
                    <td className="py-2.5 px-4 text-accent-700 font-semibold">{formatCurrency(row.interest)}</td>
                    <td className="py-2.5 px-4 text-right font-bold text-slate-900">
                      {formatCurrency(row.remainingBalance)}
                    </td>
                  </tr>
                ))}
              </tbody>
              {/* Totals Row */}
              <tfoot className="sticky bottom-0 bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-200">
                <tr>
                  <td className="py-3 px-4 uppercase tracking-wider" colSpan={2}>
                    Total ({schedule.length} Months)
                  </td>
                  <td className="py-3 px-4 font-black">{formatCurrency(totalEmi)}</td>
                  <td className="py-3 px-4 text-brand-700 font-black">{formatCurrency(totalPrincipal)}</td>
                  <td className="py-3 px-4 text-accent-700 font-black">{formatCurrency(totalInterest)}</td>
                  <td className="py-3 px-4 text-right font-black text-emerald-600">₹0</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
