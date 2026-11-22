import { describe, it, expect } from 'vitest';
import { calculateEligibility } from '../utils/eligibility';

describe('Eligibility & FOIR Calculation (FOIR <= 50%)', () => {
  it('marks eligible when FOIR is well below 50%', () => {
    // Income: 1,00,000, New EMI: 20,000, Existing EMI: 10,000 -> Ratio: 30%
    const result = calculateEligibility(
      {
        employmentType: 'Salaried',
        monthlySalary: 100000,
        existingEmis: 10000,
      },
      20000,
      10.5,
      24
    );

    expect(result.ratio).toBe(30);
    expect(result.isEligible).toBe(true);
  });

  it('marks eligible when FOIR is exactly 50%', () => {
    // Income: 1,00,000, New EMI: 30,000, Existing EMI: 20,000 -> Ratio: 50%
    const result = calculateEligibility(
      {
        employmentType: 'Salaried',
        monthlySalary: 100000,
        existingEmis: 20000,
      },
      30000,
      10.5,
      24
    );

    expect(result.ratio).toBe(50);
    expect(result.isEligible).toBe(true);
  });

  it('marks ineligible with warning when FOIR exceeds 50% and calculates safe loan amount', () => {
    // Income: 1,00,000, New EMI: 45,000, Existing EMI: 15,000 -> Total: 60,000 (60%)
    const result = calculateEligibility(
      {
        employmentType: 'Salaried',
        monthlySalary: 100000,
        existingEmis: 15000,
      },
      45000,
      10.5,
      24
    );

    expect(result.ratio).toBe(60);
    expect(result.isEligible).toBe(false);
    // Max eligible new EMI = (50% of 100000) - 15000 = 35000
    expect(result.maxEligibleEmi).toBe(35000);
    expect(result.maxEligibleLoanAmount).toBeGreaterThan(0);
  });

  it('calculates monthly income for self-employed applicants as turnover / 12', () => {
    // Annual Turnover: 24,00,000 -> Monthly Income: 2,00,000
    const result = calculateEligibility(
      {
        employmentType: 'Self-Employed',
        annualTurnover: 2400000,
        existingEmis: 30000,
      },
      50000,
      11.0,
      36
    );

    expect(result.monthlyIncome).toBe(200000);
    expect(result.totalObligations).toBe(80000);
    expect(result.ratio).toBe(40);
    expect(result.isEligible).toBe(true);
  });

  it('guards against zero income to prevent NaN and divide-by-zero crashes', () => {
    const result = calculateEligibility(
      {
        employmentType: 'Salaried',
        monthlySalary: 0,
        existingEmis: 0,
      },
      15000,
      12.0,
      24
    );

    expect(result.monthlyIncome).toBe(0);
    expect(result.isEligible).toBe(false);
    expect(result.maxEligibleLoanAmount).toBe(0);
    expect(Number.isFinite(result.ratio)).toBe(true);
  });
});
