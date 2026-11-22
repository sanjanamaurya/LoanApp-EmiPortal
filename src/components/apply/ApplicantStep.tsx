import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { applicantSchema, ApplicantFormValues } from '../../schemas/applicantSchema';
import { LoanDetails } from '../../types';
import { formatCurrency } from '../../utils/format';
import { getMaxDobString, getMinDobString } from '../../utils/date';
import { normalizePan } from '../../utils/pan';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { ArrowRight, Sliders, Edit3 } from 'lucide-react';

export interface ApplicantStepProps {
  initialValues: Partial<ApplicantFormValues>;
  loanDetails: LoanDetails;
  monthlyEmi: number;
  onNext: (data: ApplicantFormValues) => void;
  onEditLoan: () => void;
}

export const ApplicantStep: React.FC<ApplicantStepProps> = ({
  initialValues,
  loanDetails,
  monthlyEmi,
  onNext,
  onEditLoan,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ApplicantFormValues>({
    resolver: zodResolver(applicantSchema),
    defaultValues: {
      fullName: initialValues.fullName || '',
      phone: initialValues.phone || '',
      email: initialValues.email || '',
      pan: initialValues.pan || '',
      dob: initialValues.dob || '',
    },
    mode: 'onBlur',
  });

  const formRef = useRef<HTMLFormElement>(null);

  // Date limits for DOB (min 21 years old, max 70 years)
  const maxDob = getMaxDobString(21);
  const minDob = getMinDobString(70);

  const onSubmit = (data: ApplicantFormValues) => {
    onNext(data);
  };

  const onError = (formErrors: typeof errors) => {
    // Focus first invalid element
    const errorKeys = Object.keys(formErrors);
    if (errorKeys.length > 0) {
      const firstErrorField = formRef.current?.querySelector(
        `[name="${errorKeys[0]}"]`
      ) as HTMLElement | null;
      firstErrorField?.focus();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Loan Summary Strip (prefilled from calculator) */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-brand-950 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <Sliders className="w-5 h-5 text-accent-400" />
          </div>
          <div>
            <div className="text-xs uppercase font-bold text-slate-300">Selected Loan</div>
            <div className="text-base font-extrabold text-white">
              {formatCurrency(loanDetails.amount)}
              <span className="text-xs font-normal text-slate-300 ml-2">
                @ {loanDetails.rate}% for {loanDetails.tenure} mos
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-white/10">
          <div className="text-right">
            <span className="text-[11px] text-slate-300 block">Estimated EMI</span>
            <span className="text-sm font-black text-accent-400">{formatCurrency(monthlyEmi)}/mo</span>
          </div>

          <button
            type="button"
            onClick={onEditLoan}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Modify</span>
          </button>
        </div>
      </div>

      {/* Step Form */}
      <form
        ref={formRef}
        onSubmit={handleSubmit(onSubmit, onError)}
        noValidate
        className="space-y-5"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="md:col-span-2">
            <Input
              label="Full Name (as per PAN Card)"
              placeholder="e.g. Rahul Sharma"
              required
              error={errors.fullName?.message}
              {...register('fullName')}
            />
          </div>

          {/* Indian Mobile Number */}
          <div>
            <Input
              label="Mobile Number"
              placeholder="9876543210"
              maxLength={10}
              required
              leftPrefix={<span className="font-bold text-slate-600">+91</span>}
              error={errors.phone?.message}
              {...register('phone', {
                onChange: (e) => {
                  // Strips non-digits as user types
                  const cleaned = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setValue('phone', cleaned);
                },
              })}
            />
          </div>

          {/* Email Address */}
          <div>
            <Input
              label="Email Address"
              type="email"
              placeholder="e.g. rahul@example.com"
              required
              error={errors.email?.message}
              {...register('email', {
                onChange: (e) => {
                  setValue('email', e.target.value.trim().toLowerCase());
                },
              })}
            />
          </div>

          {/* PAN Card Number */}
          <div>
            <Input
              label="PAN Card Number"
              placeholder="ABCDE1234F"
              maxLength={10}
              required
              hint="Format: 5 letters, 4 digits, 1 letter (e.g. ABCDE1234F)"
              error={errors.pan?.message}
              {...register('pan', {
                onChange: (e) => {
                  const cleaned = normalizePan(e.target.value);
                  setValue('pan', cleaned);
                },
              })}
            />
          </div>

          {/* Date of Birth (Age >= 21) */}
          <div>
            <Input
              label="Date of Birth"
              type="date"
              max={maxDob}
              min={minDob}
              required
              hint="Applicant must be at least 21 years old"
              error={errors.dob?.message}
              {...register('dob')}
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 flex items-center justify-end">
          <Button
            type="submit"
            size="md"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Continue to Employment
          </Button>
        </div>
      </form>
    </div>
  );
};
