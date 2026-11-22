export const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

/**
 * Validates a PAN card string format (5 letters, 4 digits, 1 letter uppercase).
 */
export function isValidPan(pan: string): boolean {
  if (!pan) return false;
  return PAN_REGEX.test(pan.trim());
}

/**
 * Masks a 10-character PAN into format ABCDE****F.
 * If invalid length, safely masks middle characters.
 */
export function maskPan(pan: string): string {
  if (!pan) return '';
  const trimmed = pan.trim().toUpperCase();
  if (trimmed.length === 10) {
    return `${trimmed.slice(0, 5)}****${trimmed.slice(9)}`;
  }
  // Generic fallback if partially filled
  if (trimmed.length > 5) {
    return `${trimmed.slice(0, 5)}${'*'.repeat(trimmed.length - 6)}${trimmed.slice(-1)}`;
  }
  return trimmed;
}

/**
 * Cleans and uppercases PAN input as user types
 */
export function normalizePan(pan: string): string {
  return pan.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 10);
}
