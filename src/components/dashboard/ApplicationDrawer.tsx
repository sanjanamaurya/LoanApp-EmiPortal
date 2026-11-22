import React from 'react';
import { Application, ApplicationStatus } from '../../types';
import { formatCurrency, formatDate, formatFileSize } from '../../utils/format';
import { Drawer } from '../ui/Drawer';
import { Badge } from '../ui/Badge';
import { PanCell } from './PanCell';
import { StatusActions } from './StatusActions';
import { FileText, CheckCircle2, AlertTriangle, ShieldCheck, User, Briefcase, Calculator } from 'lucide-react';
import { calculateEligibility } from '../../utils/eligibility';
import { calculateAge } from '../../utils/date';

export interface ApplicationDrawerProps {
  application: Application | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, status: ApplicationStatus, remarks?: string) => Promise<boolean>;
  isUpdating: boolean;
}

export const ApplicationDrawer: React.FC<ApplicationDrawerProps> = ({
  application,
  isOpen,
  onClose,
  onUpdateStatus,
  isUpdating,
}) => {
  if (!application) return null;

  const { applicant, employment, loan, document, history, status, id, createdAt } = application;
  const age = calculateAge(applicant.dob);

  const eligibility = calculateEligibility(
    employment,
    loan.monthlyEmi,
    loan.rate,
    loan.tenure
  );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <span className="font-mono text-lg font-black text-slate-900">{id}</span>
          <Badge status={status} size="sm" />
        </div>
      }
      subtitle={
        <span className="text-xs text-slate-500">
          Submitted on {formatDate(createdAt)}
        </span>
      }
    >
      <div className="space-y-6">
        {/* 1. Applicant Section */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <User className="w-4 h-4 text-brand-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Applicant Details
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block">Full Name</span>
              <span className="font-bold text-slate-900 text-sm">{applicant.fullName}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Mobile Phone</span>
              <span className="font-bold text-slate-900">+91 {applicant.phone}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Email Address</span>
              <span className="font-bold text-slate-900 truncate block">{applicant.email}</span>
            </div>
            <div>
              <span className="text-slate-400 block">PAN Card</span>
              <PanCell pan={applicant.pan} />
            </div>
            <div>
              <span className="text-slate-400 block">Date of Birth / Age</span>
              <span className="font-bold text-slate-900">
                {applicant.dob} ({age} years)
              </span>
            </div>
          </div>
        </div>

        {/* 2. Employment & Income Section */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Briefcase className="w-4 h-4 text-brand-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Employment & Income
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block">Employment Type</span>
              <span className="font-bold text-slate-900">{employment.employmentType}</span>
            </div>
            <div>
              <span className="text-slate-400 block">
                {employment.employmentType === 'Salaried' ? 'Employer Company' : 'Business Name'}
              </span>
              <span className="font-bold text-slate-900">
                {employment.employmentType === 'Salaried'
                  ? employment.companyName
                  : employment.businessName}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Monthly Income</span>
              <span className="font-bold text-slate-900 text-sm">
                {formatCurrency(eligibility.monthlyIncome)}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Existing Monthly EMIs</span>
              <span className="font-bold text-slate-900">
                {formatCurrency(employment.existingEmis || 0)}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Loan & EMI Breakdown Section */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Calculator className="w-4 h-4 text-brand-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Loan & EMI Financial Breakdown
            </h4>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block">Sanction Amount</span>
              <span className="text-base font-extrabold text-slate-900">
                {formatCurrency(loan.amount)}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Interest Rate</span>
              <span className="text-sm font-bold text-slate-900">{loan.rate}% p.a.</span>
            </div>
            <div>
              <span className="text-slate-400 block">Tenure</span>
              <span className="text-sm font-bold text-slate-900">{loan.tenure} Months</span>
            </div>
            <div>
              <span className="text-slate-400 block">Monthly EMI</span>
              <span className="text-base font-extrabold text-brand-600">
                {formatCurrency(loan.monthlyEmi)}/mo
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Total Interest</span>
              <span className="text-sm font-bold text-slate-900">
                {formatCurrency(loan.totalInterest)}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Total Repayment</span>
              <span className="text-sm font-bold text-slate-900">
                {formatCurrency(loan.totalAmount)}
              </span>
            </div>
          </div>

          {/* Eligibility Indicator */}
          <div
            className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs ${
              eligibility.isEligible
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}
          >
            <div className="flex items-center gap-2">
              {eligibility.isEligible ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              )}
              <span>
                FOIR: <strong>{eligibility.ratio}%</strong> ({eligibility.isEligible ? 'Eligible' : 'Exceeds 50% limit'})
              </span>
            </div>
            <span className="font-semibold text-[11px]">
              Max EMI Cap: {formatCurrency(eligibility.maxEligibleEmi)}
            </span>
          </div>
        </div>

        {/* 4. Document Metadata */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <ShieldCheck className="w-4 h-4 text-brand-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Verified Document Attachment
            </h4>
          </div>

          {document ? (
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">{document.name}</p>
                  <p className="text-[11px] text-slate-500">
                    {formatFileSize(document.size)} • {document.type}
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                Verified
              </span>
            </div>
          ) : (
            <p className="text-xs text-slate-400">No document attached.</p>
          )}
        </div>

        {/* 5. Status History Timeline */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100">
            Status Transition History
          </h4>

          <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {history.map((item, index) => (
              <div key={index} className="relative text-xs">
                {/* Timeline Dot */}
                <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-brand-600 ring-4 ring-white" />
                <div className="flex items-center justify-between gap-2">
                  <Badge status={item.status} size="sm" />
                  <span className="text-[11px] text-slate-400">{formatDate(item.changedAt)}</span>
                </div>
                {item.remarks && (
                  <p className="mt-1.5 text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    {item.remarks}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 6. Reviewer Actions Form */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <StatusActions
            currentStatus={status}
            isLoading={isUpdating}
            onUpdateStatus={(newStatus, remarks) => onUpdateStatus(id, newStatus, remarks)}
          />
        </div>
      </div>
    </Drawer>
  );
};
