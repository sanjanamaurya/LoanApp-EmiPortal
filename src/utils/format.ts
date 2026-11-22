export { formatDate, formatShortDate } from './date';

/**
 * Formats a number to Indian currency string (e.g. ₹1,25,000)
 */
export function formatCurrency(amount: number): string {
  if (!Number.isFinite(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats a number to Indian number system string (e.g. 1,25,000)
 */
export function formatIndianNumber(value: number): string {
  if (!Number.isFinite(value)) return '0';
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Formats byte size into human-readable string (e.g. 1.8 MB, 450 KB)
 */
export function formatFileSize(bytes: number): string {
  if (bytes <= 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const val = parseFloat((bytes / Math.pow(k, i)).toFixed(1));
  return `${val} ${sizes[i]}`;
}
