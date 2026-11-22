import { AGE_LIMITS } from '../constants';

/**
 * Calculates exact age in years based on birthdate and a reference date (default: today).
 * Considers month and day precision.
 */
export function calculateAge(dobString: string, referenceDate: Date = new Date()): number {
  if (!dobString) return 0;
  const dob = new Date(dobString);
  if (isNaN(dob.getTime())) return 0;

  let age = referenceDate.getFullYear() - dob.getFullYear();
  const m = referenceDate.getMonth() - dob.getMonth();

  if (m < 0 || (m === 0 && referenceDate.getDate() < dob.getDate())) {
    age--;
  }

  return age;
}

/**
 * Validates whether applicant age meets required bounds (>= 21 and <= 70).
 */
export function isValidAge(
  dobString: string,
  minAge = AGE_LIMITS.MIN_AGE,
  maxAge = AGE_LIMITS.MAX_AGE,
  referenceDate: Date = new Date()
): { valid: boolean; age: number; error?: string } {
  if (!dobString) {
    return { valid: false, age: 0, error: 'Date of birth is required' };
  }

  const dob = new Date(dobString);
  if (isNaN(dob.getTime())) {
    return { valid: false, age: 0, error: 'Please enter a valid date' };
  }

  if (dob > referenceDate) {
    return { valid: false, age: 0, error: 'Date of birth cannot be in the future' };
  }

  const age = calculateAge(dobString, referenceDate);

  if (age < minAge) {
    return {
      valid: false,
      age,
      error: `Applicant must be at least ${minAge} years old (current: ${age})`,
    };
  }

  if (age > maxAge) {
    return {
      valid: false,
      age,
      error: `Applicant age exceeds upper limit of ${maxAge} years (current: ${age})`,
    };
  }

  return { valid: true, age };
}

/**
 * Formats a Date to YYYY-MM-DD for native input max/min attributes
 */
export function toInputDateFormat(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns the maximum allowed DOB (today - minAge years)
 */
export function getMaxDobString(minAge = AGE_LIMITS.MIN_AGE, referenceDate: Date = new Date()): string {
  const d = new Date(referenceDate);
  d.setFullYear(d.getFullYear() - minAge);
  return toInputDateFormat(d);
}

/**
 * Returns the minimum allowed DOB (today - maxAge years)
 */
export function getMinDobString(maxAge = AGE_LIMITS.MAX_AGE, referenceDate: Date = new Date()): string {
  const d = new Date(referenceDate);
  d.setFullYear(d.getFullYear() - maxAge);
  return toInputDateFormat(d);
}

/**
 * Formats an ISO date string to readable format: e.g. "12 Oct 2026, 04:30 PM"
 */
export function formatDate(isoString: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString;

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

/**
 * Formats an ISO date string to short date: e.g. "12 Oct 2026"
 */
export function formatShortDate(isoString: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString;

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}
