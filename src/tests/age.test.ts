import { describe, it, expect } from 'vitest';
import { calculateAge, isValidAge } from '../utils/date';

describe('Age & Date of Birth Validation (Age >= 21)', () => {
  const fixedToday = new Date('2026-11-22T00:00:00.000Z');

  it('accepts applicant who is exactly 21 years old today', () => {
    const dob = '2005-11-22';
    const age = calculateAge(dob, fixedToday);
    expect(age).toBe(21);
    const result = isValidAge(dob, 21, 70, fixedToday);
    expect(result.valid).toBe(true);
  });

  it('rejects applicant who is one day short of 21 years old', () => {
    const dob = '2005-11-23'; // Tomorrow will be 21st birthday
    const age = calculateAge(dob, fixedToday);
    expect(age).toBe(20);
    const result = isValidAge(dob, 21, 70, fixedToday);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('at least 21 years old');
  });

  it('rejects future date of birth', () => {
    const dob = '2027-01-01';
    const result = isValidAge(dob, 21, 70, fixedToday);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('cannot be in the future');
  });

  it('handles leap-year birthdates correctly', () => {
    const dob = '2004-02-29';
    const age = calculateAge(dob, fixedToday);
    expect(age).toBe(22);
    const result = isValidAge(dob, 21, 70, fixedToday);
    expect(result.valid).toBe(true);
  });

  it('rejects unrealistic age above 70 years', () => {
    const dob = '1950-01-01'; // 76 years old in 2026
    const result = isValidAge(dob, 21, 70, fixedToday);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('exceeds upper limit');
  });
});
