import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApplications } from '../hooks/useApplications';
import { useDraftAutosave } from '../hooks/useDraftAutosave';
import { Application, ApplicantData, DocumentMetadata, EmploymentData, LoanDetails } from '../types';
import { LOAN_LIMITS } from '../constants';
import { calculateEmi } from '../utils/emi';
import { generateApplicationId } from '../utils/id';
import { Stepper } from '../components/ui/Stepper';
import { ApplicantStep } from '../components/apply/ApplicantStep';
import { EmploymentStep } from '../components/apply/EmploymentStep';
import { ReviewStep } from '../components/apply/ReviewStep';
import { SuccessScreen } from '../components/apply/SuccessScreen';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Check, RotateCcw, ShieldCheck } from 'lucide-react';
import { useToast } from '../hooks/useToast';

export const ApplyPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { applications, addApplication } = useApplications();
  const { showSuccess } = useToast();

  // Query parameter defaults for loan details
  const initialAmount = useMemo(() => {
    const qAmount = searchParams.get('amount');
    return qAmount ? parseInt(qAmount, 10) : LOAN_LIMITS.DEFAULT_AMOUNT;
  }, [searchParams]);

  const initialRate = useMemo(() => {
    const qRate = searchParams.get('rate');
    return qRate ? parseFloat(qRate) : LOAN_LIMITS.DEFAULT_RATE;
  }, [searchParams]);

  const initialTenure = useMemo(() => {
    const qTenure = searchParams.get('tenure');
    return qTenure ? parseInt(qTenure, 10) : LOAN_LIMITS.DEFAULT_TENURE;
  }, [searchParams]);

  // Form State
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [loanDetails, setLoanDetails] = useState<LoanDetails>({
    amount: initialAmount,
    rate: initialRate,
    tenure: initialTenure,
  });

  const [applicant, setApplicant] = useState<ApplicantData>({
    fullName: '',
    phone: '',
    email: '',
    pan: '',
    dob: '',
  });

  const [employment, setEmployment] = useState<EmploymentData>({
    employmentType: 'Salaried',
    companyName: '',
    monthlySalary: undefined,
    businessName: '',
    annualTurnover: undefined,
    existingEmis: 0,
  });

  const [document, setDocument] = useState<DocumentMetadata | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedApplication, setSubmittedApplication] = useState<Application | null>(null);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  // Auto-save draft hook
  const { lastSaved, isSaving, restoreDraft, resetDraft } = useDraftAutosave({
    step: currentStep,
    loan: loanDetails,
    applicant,
    employment,
    document,
    consent: false,
  });

  // Restore draft on mount if exists
  useEffect(() => {
    const draft = restoreDraft();
    if (draft) {
      if (draft.loan) setLoanDetails(draft.loan);
      if (draft.applicant) setApplicant(draft.applicant);
      if (draft.employment) setEmployment(draft.employment);
      if (draft.document) setDocument(draft.document);
      if (draft.step && draft.step >= 1 && draft.step <= 3) {
        setCurrentStep(draft.step);
        // Mark previous steps as completed
        const prevSteps: number[] = [];
        for (let i = 1; i < draft.step; i++) prevSteps.push(i);
        setCompletedSteps(prevSteps);
      }
    }
  }, [restoreDraft]);

  // Calculated EMI for current loan settings
  const emiCalc = useMemo(() => {
    return calculateEmi(loanDetails.amount, loanDetails.rate, loanDetails.tenure);
  }, [loanDetails]);

  // Handle Step 1 Next
  const handleApplicantSubmit = (data: ApplicantData) => {
    setApplicant(data);
    if (!completedSteps.includes(1)) {
      setCompletedSteps((prev) => [...prev, 1]);
    }
    setCurrentStep(2);
  };

  // Handle Step 2 Next
  const handleEmploymentSubmit = (data: EmploymentData) => {
    setEmployment(data);
    if (!completedSteps.includes(2)) {
      setCompletedSteps((prev) => [...prev, 2]);
    }
    setCurrentStep(3);
  };

  // Step Guard: prevent jumping ahead past incomplete steps
  const handleStepClick = (stepId: number) => {
    if (stepId === currentStep) return;
    if (stepId < currentStep) {
      setCurrentStep(stepId);
    } else {
      // Trying to jump forward: allow only if all previous steps are marked completed
      const allPrevDone = Array.from({ length: stepId - 1 }, (_, i) => i + 1).every((s) =>
        completedSteps.includes(s)
      );
      if (allPrevDone) {
        setCurrentStep(stepId);
      }
    }
  };

  // Full submission
  const handleFinalSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Re-validate document
      if (!document) {
        setIsSubmitting(false);
        return;
      }

      // Simulate network submission delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      const newId = generateApplicationId(applications);
      const now = new Date().toISOString();

      const newApp: Application = {
        id: newId,
        applicant,
        employment,
        loan: {
          ...loanDetails,
          ...emiCalc,
        },
        document,
        status: 'Pending',
        createdAt: now,
        updatedAt: now,
        history: [
          {
            status: 'Pending',
            changedAt: now,
            remarks: 'Application submitted online via Access Assist loan portal.',
          },
        ],
      };

      addApplication(newApp);
      resetDraft();
      setSubmittedApplication(newApp);
      showSuccess('Application Submitted', `Application ID: ${newId}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartOver = useCallback(() => {
    resetDraft();
    setLoanDetails({
      amount: LOAN_LIMITS.DEFAULT_AMOUNT,
      rate: LOAN_LIMITS.DEFAULT_RATE,
      tenure: LOAN_LIMITS.DEFAULT_TENURE,
    });
    setApplicant({
      fullName: '',
      phone: '',
      email: '',
      pan: '',
      dob: '',
    });
    setEmployment({
      employmentType: 'Salaried',
      companyName: '',
      monthlySalary: undefined,
      businessName: '',
      annualTurnover: undefined,
      existingEmis: 0,
    });
    setDocument(null);
    setCurrentStep(1);
    setCompletedSteps([]);
    setIsResetDialogOpen(false);
  }, [resetDraft]);

  const stepsList = [
    { id: 1, label: 'Applicant Details', description: 'Personal & KYC info' },
    { id: 2, label: 'Employment & Eligibility', description: 'Income & FOIR check' },
    { id: 3, label: 'Document & Review', description: 'Upload proof & submit' },
  ];

  if (submittedApplication) {
    return (
      <SuccessScreen
        application={submittedApplication}
        onApplyAgain={() => {
          setSubmittedApplication(null);
          handleStartOver();
        }}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Digital Loan Onboarding</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Apply for Loan
          </h1>
        </div>

        {/* Draft Auto-save status and Start Over */}
        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
            {isSaving ? (
              <span className="text-slate-400">Saving...</span>
            ) : lastSaved ? (
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <Check className="w-3.5 h-3.5" /> Draft saved
              </span>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => setIsResetDialogOpen(true)}
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-rose-600 transition-colors p-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Start Over</span>
          </button>
        </div>
      </div>

      {/* Stepper Navigation */}
      <Stepper
        steps={stepsList}
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepClick={handleStepClick}
      />

      {/* Active Step Content */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        {currentStep === 1 && (
          <ApplicantStep
            initialValues={applicant}
            loanDetails={loanDetails}
            monthlyEmi={emiCalc.monthlyEmi}
            onNext={handleApplicantSubmit}
            onEditLoan={() => {
              setCurrentStep(2);
            }}
          />
        )}

        {currentStep === 2 && (
          <EmploymentStep
            initialValues={employment}
            loanDetails={loanDetails}
            monthlyEmi={emiCalc.monthlyEmi}
            onNext={handleEmploymentSubmit}
            onBack={() => setCurrentStep(1)}
            onUpdateLoanDetails={(updated: Partial<LoanDetails>) => {
              setLoanDetails((prev: LoanDetails) => ({ ...prev, ...updated }));
            }}
          />
        )}

        {currentStep === 3 && (
          <ReviewStep
            loanDetails={loanDetails}
            monthlyEmi={emiCalc.monthlyEmi}
            totalInterest={emiCalc.totalInterest}
            totalAmount={emiCalc.totalAmount}
            applicant={applicant}
            employment={employment}
            document={document}
            onDocumentChange={setDocument}
            onEditStep={(stepId: number) => setCurrentStep(stepId)}
            onSubmit={handleFinalSubmit}
            onBack={() => setCurrentStep(2)}
            isSubmitting={isSubmitting}
          />
        )}
      </div>

      {/* Start Over Confirmation Modal */}
      <ConfirmDialog
        isOpen={isResetDialogOpen}
        title="Start Over with a New Application?"
        message="This will clear your current draft data and reset all fields. Are you sure you want to proceed?"
        confirmLabel="Yes, Start Over"
        cancelLabel="Cancel"
        onConfirm={handleStartOver}
        onCancel={() => setIsResetDialogOpen(false)}
      />
    </div>
  );
};
