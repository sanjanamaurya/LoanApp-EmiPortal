import { ApplicationStatus, EmploymentType, SortOption } from '../types';

export const LOAN_LIMITS = {
  MIN_AMOUNT: 50_000,
  MAX_AMOUNT: 25_00_000,
  STEP_AMOUNT: 10_000,
  DEFAULT_AMOUNT: 5_00_000,

  MIN_RATE: 8.0,
  MAX_RATE: 24.0,
  STEP_RATE: 0.1,
  DEFAULT_RATE: 10.5,

  MIN_TENURE: 6,
  MAX_TENURE: 60,
  STEP_TENURE: 1,
  DEFAULT_TENURE: 24,
} as const;

export const EMPLOYMENT_LIMITS = {
  MIN_SALARY: 10_000,
  MIN_TURNOVER: 1_20_000,
  MAX_FOIR_RATIO: 50, // 50% max threshold for EMI obligations
  SAFE_FOIR_RATIO: 40,
} as const;

export const AGE_LIMITS = {
  MIN_AGE: 21,
  MAX_AGE: 70,
} as const;

export const DOCUMENT_CONFIG = {
  MAX_FILE_SIZE: 2 * 1024 * 1024, // 2MB
  MAX_FILE_SIZE_MB: 2,
  ALLOWED_EXTENSIONS: ['.pdf', '.jpg', '.jpeg', '.png'],
  ALLOWED_MIME_TYPES: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
} as const;

export const API_CONFIG = {
  DELAY_MS: 600,
  FAILURE_RATE: 0.20, // 20% simulated failure
} as const;

export const STORAGE_KEYS = {
  APPLICATIONS: 'access_assist_applications_v1',
  DRAFT: 'access_assist_draft_v1',
} as const;

export const STATUS_LIST: readonly ApplicationStatus[] = [
  'Pending',
  'Under Review',
  'Approved',
  'Rejected',
] as const;

export const EMPLOYMENT_TYPE_LIST: readonly EmploymentType[] = [
  'Salaried',
  'Self-Employed',
] as const;

export const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: 'Date: Newest First', value: 'date_desc' },
  { label: 'Date: Oldest First', value: 'date_asc' },
  { label: 'Loan Amount: High to Low', value: 'amount_desc' },
  { label: 'Loan Amount: Low to High', value: 'amount_asc' },
];

export const DRAFT_VERSION = 1;
