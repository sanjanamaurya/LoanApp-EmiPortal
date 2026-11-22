import React, { useState } from 'react';
import { ApplicantData, DocumentMetadata, EmploymentData, LoanDetails } from '../../types';
import { formatCurrency } from '../../utils/format';
import { FileDropzone } from '../ui/FileDropzone';
import { Button } from '../ui/Button';
import { maskPan } from '../../utils/pan';
import { ArrowLeft, Check, Edit2, ShieldAlert, Sparkles } from 'lucide-react';
import { calculateEligibility } from '../../utils/eligibility';

export interface ReviewStepProps {
  loanDetails: LoanDetails;
  monthlyEmi: number;
  totalInterest: number;
  totalAmount: number;
  applicant: ApplicantData;
  employment: EmploymentData;
  document: DocumentMetadata | null;
  onDocumentChange: (doc: DocumentMetadata | null) => void;
  onEditStep: (stepId: number) => void;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  loanDetails,
  monthlyEmi,
  totalInterest,
  totalAmount,
  applicant,
  employment,
  document,
  onDocumentChange,
  onEditStep,
  onSubmit,
  onBack,
  isSubmitting,
}) => {
  const [consentChecked, setConsentChecked] = useState(false);
  const [docError, setDocError] = useState<string | null>(null);

  const eligibility = calculateEligibility(
    employment,
    monthlyEmi,
    loanDetails.rate,
    loanDetails.tenure
  );

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDocError(null);

    if (!document) {
      setDocError('Please upload your PAN or Address Proof document to submit.');
      return;
    }

    if (!consentChecked) {
      return;
    }

    onSubmit();
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      {/* 1. Document Upload Area */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-900 block">
          Document Verification (Mock Upload) <span className="text-rose-500">*</span>
        </label>
        <p className="text-xs text-slate-500">
          Upload a clear copy of your PAN card, Aadhaar, or latest salary slip for mock KYC check.
        </p>

        <FileDropzone
          value={document}
          onChange={(doc) => {
            onDocumentChange(doc);
            if (doc) setDocError(null);
          }}
          error={docError || undefined}
        />
      </div>

      {/* 2. Review Summary Cards */}
      <div className="space-y-4 pt-2">
        <h3 className="text-base font-bold text-slate-900">Application Summary</h3>

        {/* Loan Details Group */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold uppercase text-slate-400">Loan & Repayment</span>
            <button
              type="button"
              onClick={() => onEditStep(1)}
              className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block">Principal Amount</span>
              <span className="text-sm font-bold text-slate-900">{formatCurrency(loanDetails.amount)}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Interest Rate</span>
              <span className="text-sm font-bold text-slate-900">{loanDetails.rate}% p.a.</span>
            </div>
            <div>
              <span className="text-slate-400 block">Loan Tenure</span>
              <span className="text-sm font-bold text-slate-900">{loanDetails.tenure} Months</span>
            </div>
            <div>
              <span className="text-slate-400 block">Calculated EMI</span>
              <span className="text-sm font-extrabold text-brand-600">{formatCurrency(monthlyEmi)}/mo</span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl">
            <span>Total Payable: <strong>{formatCurrency(totalAmount)}</strong></span>
            <span>Total Interest: <strong>{formatCurrency(totalInterest)}</strong></span>
          </div>
        </div>

        {/* Applicant Details Group */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold uppercase text-slate-400">Applicant Information</span>
            <button
              type="button"
              onClick={() => onEditStep(1)}
              className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block">Full Name</span>
              <span className="text-sm font-bold text-slate-900">{applicant.fullName}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Contact</span>
              <span className="text-sm font-bold text-slate-900">+91 {applicant.phone}</span>
              <span className="text-[11px] text-slate-500 block truncate">{applicant.email}</span>
            </div>
            <div>
              <span className="text-slate-400 block">PAN Card & DOB</span>
              <span className="text-sm font-bold text-slate-900 font-mono">{maskPan(applicant.pan)}</span>
              <span className="text-[11px] text-slate-500 block">{applicant.dob}</span>
            </div>
          </div>
        </div>

        {/* Employment & Eligibility Group */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold uppercase text-slate-400">Employment & Eligibility</span>
            <button
              type="button"
              onClick={() => onEditStep(2)}
              className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block">Type</span>
              <span className="text-sm font-bold text-slate-900">{employment.employmentType}</span>
              <span className="text-[11px] text-slate-500 block">
                {employment.employmentType === 'Salaried' ? employment.companyName : employment.businessName}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Monthly Income</span>
              <span className="text-sm font-bold text-slate-900">{formatCurrency(eligibility.monthlyIncome)}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Existing EMIs</span>
              <span className="text-sm font-bold text-slate-900">{formatCurrency(employment.existingEmis || 0)}</span>
            </div>
          </div>

          {/* Eligibility Indicator Badge */}
          <div className="pt-2">
            {eligibility.isEligible ? (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-medium">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Eligibility Passed: Obligation is {eligibility.ratio}% of income (≤ 50% limit).</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 text-amber-800 text-xs font-medium">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Note: Obligation is {eligibility.ratio}% of income (above 50%). Review may take longer.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Consent Checkbox */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={consentChecked}
            onChange={(e) => setConsentChecked(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300"
          />
          <span className="text-xs text-slate-700 leading-relaxed font-medium">
            I confirm the details provided are correct and consent to a mock credit check under Access Assist lending policy terms.
          </span>
        </label>
      </div>

      {/* Stepper Navigation Buttons */}
      <div className="pt-4 flex items-center justify-between gap-4">
        <Button
          type="button"
          variant="outline"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={onBack}
          disabled={isSubmitting}
        >
          Back
        </Button>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isSubmitting}
          disabled={!consentChecked || isSubmitting}
          rightIcon={<Check className="w-4 h-4" />}
          className="shadow-glow-brand"
        >
          Submit Loan Application
        </Button>
      </div>
    </form>
  );
};
