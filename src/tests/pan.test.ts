import { describe, it, expect } from 'vitest';
import { isValidPan, maskPan, normalizePan } from '../utils/pan';

describe('PAN Validation & Masking Utilities', () => {
  it('validates correct Indian PAN formats (5 letters, 4 digits, 1 letter)', () => {
    expect(isValidPan('ABCDE1234F')).toBe(true);
    expect(isValidPan('BNZPA9876K')).toBe(true);
    expect(isValidPan('AAAPA1111A')).toBe(true);
  });

  it('rejects invalid PAN formats', () => {
    // Lowercase
    expect(isValidPan('abcde1234f')).toBe(false);
    // 9 characters (short)
    expect(isValidPan('ABCD1234F')).toBe(false);
    // 11 characters (long)
    expect(isValidPan('ABCDE12345F')).toBe(false);
    // Wrong order (digits first)
    expect(isValidPan('12345ABCDE')).toBe(false);
    // Special characters
    expect(isValidPan('ABCD@1234F')).toBe(false);
    // Empty string
    expect(isValidPan('')).toBe(false);
  });

  it('masks sensitive PAN digits as ABCDE****F', () => {
    expect(maskPan('ABCDE1234F')).toBe('ABCDE****F');
    expect(maskPan('BNZPA9876K')).toBe('BNZPA****K');
  });

  it('normalizes input by trimming and uppercasing', () => {
    expect(normalizePan(' abcde1234f ')).toBe('ABCDE1234F');
    expect(normalizePan('abc-1234-f')).toBe('ABC1234F');
  });
});
