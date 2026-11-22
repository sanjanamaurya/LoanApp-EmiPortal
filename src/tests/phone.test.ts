import { describe, it, expect } from 'vitest';
import { isValidPhone } from '../utils/validators';

describe('Indian Phone Validation', () => {
  it('accepts valid 10-digit Indian mobile numbers starting with 6, 7, 8, 9', () => {
    expect(isValidPhone('9876543210')).toBe(true);
    expect(isValidPhone('8123456789')).toBe(true);
    expect(isValidPhone('7012345678')).toBe(true);
    expect(isValidPhone('6234567890')).toBe(true);
  });

  it('rejects invalid mobile numbers', () => {
    // Starts with 5, 4, 3, etc.
    expect(isValidPhone('5876543210')).toBe(false);
    expect(isValidPhone('1234567890')).toBe(false);
    // 9 digits (too short)
    expect(isValidPhone('987654321')).toBe(false);
    // 11 digits (too long)
    expect(isValidPhone('98765432100')).toBe(false);
    // Letters
    expect(isValidPhone('98765abcde')).toBe(false);
    // Empty
    expect(isValidPhone('')).toBe(false);
  });
});
