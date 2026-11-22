export type ApplicationStatus = 'Pending' | 'Under Review' | 'Approved' | 'Rejected';

export type EmploymentType = 'Salaried' | 'Self-Employed';

export interface LoanDetails {
  amount: number;
  rate: number;
  tenure: number;
}

export interface EmiCalculationResult {
  monthlyEmi: number;
  totalInterest: number;
  totalAmount: number;
  principal: number;
}

export interface AmortizationRow {
  month: number;
  openingBalance: number;
  emi: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

export interface ApplicantData {
  fullName: string;
  phone: string;
  email: string;
  pan: string;
  dob: string; // YYYY-MM-DD
}

export interface EmploymentData {
  employmentType: EmploymentType;
  companyName?: string;
  monthlySalary?: number;
  businessName?: string;
  annualTurnover?: number;
  existingEmis: number;
}

export interface EligibilityResult {
  monthlyIncome: number;
  newEmi: number;
  existingEmis: number;
  totalObligations: number;
  ratio: number;
  isEligible: boolean;
  maxEligibleEmi: number;
  maxEligibleLoanAmount: number;
}

export interface DocumentMetadata {
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
}

export interface StatusHistoryItem {
  status: ApplicationStatus;
  changedAt: string;
  remarks?: string;
}

export interface Application {
  id: string; // e.g. "AA-2026-0001"
  applicant: ApplicantData;
  employment: EmploymentData;
  loan: LoanDetails & EmiCalculationResult;
  document: DocumentMetadata;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
  history: StatusHistoryItem[];
}

export interface ApplicationDraft {
  version: number;
  step: number;
  loan: LoanDetails;
  applicant: ApplicantData;
  employment: EmploymentData;
  document: DocumentMetadata | null;
  consent: boolean;
  lastSaved: string;
}

export type SortOption = 'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc';

export interface DashboardFilters {
  q: string;
  status: 'All' | ApplicationStatus;
  sort: SortOption;
}

export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onRetry?: () => void;
}
