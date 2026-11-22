import { describe, it, expect } from 'vitest';
import { formatCurrency, formatIndianNumber, formatFileSize } from '../utils/format';

describe('Indian Currency & Number Formatting Utilities', () => {
  it('formats currency according to en-IN currency rules', () => {
    const formatted125k = formatCurrency(125000);
    expect(formatted125k).toContain('1,25,000');
    expect(formatted125k).toContain('₹');

    const formatted10L = formatCurrency(1000000);
    expect(formatted10L).toContain('10,00,000');

    const formattedZero = formatCurrency(0);
    expect(formattedZero).toContain('0');
  });

  it('formats numbers into Indian numbering system', () => {
    expect(formatIndianNumber(50000)).toBe('50,000');
    expect(formatIndianNumber(2500000)).toBe('25,00,000');
  });

  it('formats file sizes into human-readable strings', () => {
    expect(formatFileSize(1024 * 1024 * 1.5)).toBe('1.5 MB');
    expect(formatFileSize(1024 * 350)).toBe('350 KB');
  });
});
