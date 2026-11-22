import { describe, it, expect } from 'vitest';
import { calculateEmi, generateAmortizationSchedule } from '../utils/emi';
import { LOAN_LIMITS } from '../constants';

describe('EMI Calculation Utilities', () => {
  it('calculates known reference EMI accurately: ₹10,00,000 @ 10% for 12 months ≈ ₹87,916', () => {
    const result = calculateEmi(1000000, 10, 12);
    expect(result.monthlyEmi).toBe(87916);
    expect(result.totalAmount).toBe(87916 * 12);
    expect(result.totalInterest).toBe(87916 * 12 - 1000000);
  });

  it('handles zero interest rate (r = 0) edge case properly (EMI = P / n)', () => {
    const result = calculateEmi(600000, 0, 12);
    expect(result.monthlyEmi).toBe(50000);
    expect(result.totalInterest).toBe(0);
    expect(result.totalAmount).toBe(600000);
  });

  it('calculates boundaries at minimum limits (₹50,000 @ 8% for 6 months)', () => {
    const result = calculateEmi(LOAN_LIMITS.MIN_AMOUNT, LOAN_LIMITS.MIN_RATE, LOAN_LIMITS.MIN_TENURE);
    expect(result.monthlyEmi).toBeGreaterThan(0);
    expect(result.totalInterest).toBeGreaterThan(0);
    expect(result.totalAmount).toBe(result.monthlyEmi * LOAN_LIMITS.MIN_TENURE);
  });

  it('calculates boundaries at maximum limits (₹25,00,000 @ 24% for 60 months)', () => {
    const result = calculateEmi(LOAN_LIMITS.MAX_AMOUNT, LOAN_LIMITS.MAX_RATE, LOAN_LIMITS.MAX_TENURE);
    expect(result.monthlyEmi).toBeGreaterThan(0);
    expect(result.totalInterest).toBeGreaterThan(0);
    expect(result.totalAmount).toBe(result.monthlyEmi * LOAN_LIMITS.MAX_TENURE);
  });

  it('generates amortization schedule where principal sums exactly to loan amount and final balance is 0', () => {
    const principal = 500000;
    const rate = 11.5;
    const tenure = 24;

    const schedule = generateAmortizationSchedule(principal, rate, tenure);

    expect(schedule).toHaveLength(tenure);

    // Sum of all principal parts should equal the initial loan amount
    const sumPrincipal = schedule.reduce((sum, row) => sum + row.principal, 0);
    expect(sumPrincipal).toBe(principal);

    // Final month remaining balance must be exactly 0
    const lastRow = schedule[schedule.length - 1];
    expect(lastRow.remainingBalance).toBe(0);

    // Balance should never be negative in any month
    schedule.forEach((row) => {
      expect(row.remainingBalance).toBeGreaterThanOrEqual(0);
    });
  });
});
