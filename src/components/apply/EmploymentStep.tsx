import React from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { employmentSchema, EmploymentFormValues } from '../../schemas/employmentSchema';
import { EmploymentType, LoanDetails } from '../../types';
import { calculateEligibility } from '../../utils/eligibility';
import { Input } from '../ui/Input';
import { NumberField } from '../ui/NumberField';
import { RadioCard } from '../ui/RadioCard';
import { Button } from '../ui/Button';
import { EligibilityCard } from './EligibilityCard';
import { ArrowLeft, ArrowRight, Briefcase, Building2, Sliders } from 'lucide-react';
import { LOAN_LIMITS } from '../../constants';

export interface EmploymentStepProps {
  initialValues: Partial<EmploymentFormValues>;
  loanDetails: LoanDetails;
  monthlyEmi: number;
  onNext: (data: EmploymentFormValues) => void;
  onBack: () => void;
  onUpdateLoanDetails: (updated: Partial<LoanDetails>) => void;
}

export const EmploymentStep: React.FC<EmploymentStepProps> = ({
  initialValues,
  loanDetails,
  monthlyEmi,
  onNext,
  onBack,
  onUpdateLoanDetails,
}) => {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EmploymentFormValues>({
    resolver: zodResolver(employmentSchema) as any,
    defaultValues: {
      employmentType: initialValues.employmentType || 'Salaried',
      companyName: initialValues.companyName || '',
      monthlySalary: initialValues.monthlySalary,
      businessName: initialValues.businessName || '',
      annualTurnover: initialValues.annualTurnover,
      existingEmis: initialValues.existingEmis || 0,
    },
    mode: 'onBlur',
  });

  const [showMiniLoanEditor, setShowMiniLoanEditor] = React.useState(false);

  const watchedType = watch('employmentType');
  const watchedSalary = watch('monthlySalary');
  const watchedTurnover = watch('annualTurnover');
  const watchedExistingEmis = watch('existingEmis');

  // Compute live eligibility on every keystroke
  const liveEligibility = React.useMemo(() => {
    return calculateEligibility(
      {
        employmentType: watchedType,
        monthlySalary: watchedSalary,
        annualTurnover: watchedTurnover,
        existingEmis: watchedExistingEmis,
      },
      monthlyEmi,
      loanDetails.rate,
      loanDetails.tenure
    );
  }, [watchedType, watchedSalary, watchedTurnover, watchedExistingEmis, monthlyEmi, loanDetails]);

  // Handle switching employment type: clear opposite fields
  const handleTypeChange = (newType: EmploymentType) => {
    setValue('employmentType', newType);
    if (newType === 'Salaried') {
      setValue('businessName', '');
      setValue('annualTurnover', undefined);
    } else {
      setValue('companyName', '');
      setValue('monthlySalary', undefined);
    }
  };

  const onSubmit: SubmitHandler<EmploymentFormValues> = (data) => {
    onNext(data);
  };

  return (
    <div className="space-y-6">
      {/* Inline Mini-panel to adjust loan parameters without leaving Step 2 */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Sliders className="w-4 h-4 text-brand-600" />
            <span>Loan Parameters & EMI Setting</span>
          </div>
          <button
            type="button"
            onClick={() => setShowMiniLoanEditor(!showMiniLoanEditor)}
            className="text-xs font-semibold text-brand-600 hover:text-brand-700"
          >
            {showMiniLoanEditor ? 'Close' : 'Adjust Amount / Tenure'}
          </button>
        </div>

        {showMiniLoanEditor && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 animate-slide-in">
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                Loan Amount (₹)
              </label>
              <input
                type="number"
                min={LOAN_LIMITS.MIN_AMOUNT}
                max={LOAN_LIMITS.MAX_AMOUNT}
                step={LOAN_LIMITS.STEP_AMOUNT}
                value={loanDetails.amount}
                onChange={(e) => onUpdateLoanDetails({ amount: Number(e.target.value) })}
                className="w-full text-xs font-bold px-3 py-2 border rounded-lg border-slate-300 focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                Interest Rate (%)
              </label>
              <input
                type="number"
                step="0.1"
                min={LOAN_LIMITS.MIN_RATE}
                max={LOAN_LIMITS.MAX_RATE}
                value={loanDetails.rate}
                onChange={(e) => onUpdateLoanDetails({ rate: Number(e.target.value) })}
                className="w-full text-xs font-bold px-3 py-2 border rounded-lg border-slate-300 focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                Tenure (Months)
              </label>
              <input
                type="number"
                min={LOAN_LIMITS.MIN_TENURE}
                max={LOAN_LIMITS.MAX_TENURE}
                value={loanDetails.tenure}
                onChange={(e) => onUpdateLoanDetails({ tenure: Number(e.target.value) })}
                className="w-full text-xs font-bold px-3 py-2 border rounded-lg border-slate-300 focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        {/* Employment Type Selector */}
        <Controller
          name="employmentType"
          control={control}
          render={({ field }) => (
            <RadioCard
              name="employmentType"
              label="Employment Type"
              value={field.value}
              onChange={handleTypeChange}
              options={[
                {
                  value: 'Salaried',
                  title: 'Salaried Professional',
                  description: 'Employed at a private, public, or government enterprise',
                  icon: <Building2 className="w-5 h-5" />,
                },
                {
                  value: 'Self-Employed',
                  title: 'Self-Employed / Business',
                  description: 'Sole proprietor, partner, director, or freelancer',
                  icon: <Briefcase className="w-5 h-5" />,
                },
              ]}
              error={errors.employmentType?.message}
            />
          )}
        />

        {/* Conditional Fields based on Employment Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {watchedType === 'Salaried' ? (
            <>
              <div>
                <Input
                  label="Company Name"
                  placeholder="e.g. Infosys, TCS, HDFC"
                  required
                  error={errors.companyName?.message}
                  {...register('companyName')}
                />
              </div>

              <div>
                <Controller
                  name="monthlySalary"
                  control={control}
                  render={({ field }) => (
                    <NumberField
                      label="Net Monthly In-hand Salary"
                      placeholder="e.g. 85000"
                      leftPrefix={<span className="font-bold text-slate-400">₹</span>}
                      required
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.monthlySalary?.message}
                    />
                  )}
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <Input
                  label="Business / Enterprise Name"
                  placeholder="e.g. Apex Retail Services"
                  required
                  error={errors.businessName?.message}
                  {...register('businessName')}
                />
              </div>

              <div>
                <Controller
                  name="annualTurnover"
                  control={control}
                  render={({ field }) => (
                    <NumberField
                      label="Annual Business Turnover"
                      placeholder="e.g. 2400000"
                      leftPrefix={<span className="font-bold text-slate-400">₹</span>}
                      required
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.annualTurnover?.message}
                    />
                  )}
                />
              </div>
            </>
          )}

          {/* Existing Monthly EMIs */}
          <div className="md:col-span-2">
            <Controller
              name="existingEmis"
              control={control}
              render={({ field }) => (
                <NumberField
                  label="Existing Monthly EMI Obligations (if any)"
                  placeholder="0"
                  leftPrefix={<span className="font-bold text-slate-400">₹</span>}
                  hint="Include credit card EMIs, car loans, personal loans. Enter 0 if none."
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.existingEmis?.message}
                />
              )}
            />
          </div>
        </div>

        {/* Live Eligibility Feedback Card */}
        <EligibilityCard
          eligibility={liveEligibility}
          onApplySuggestedAmount={(amount) => {
            onUpdateLoanDetails({ amount });
          }}
        />

        {/* Stepper Navigation Buttons */}
        <div className="pt-4 flex items-center justify-between gap-4">
          <Button
            type="button"
            variant="outline"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={onBack}
          >
            Back
          </Button>

          <Button
            type="submit"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Continue to Document & Review
          </Button>
        </div>
      </form>
    </div>
  );
};
