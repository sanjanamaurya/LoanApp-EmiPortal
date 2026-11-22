import { EligibilityResult, EmploymentData } from '../types';
import { EMPLOYMENT_LIMITS, LOAN_LIMITS } from '../constants';

/**
 * Calculates applicant loan eligibility based on FOIR (Fixed Obligation to Income Ratio).
 * 
 * Rules:
 * - Monthly Income = Salary (Salaried) OR Annual Turnover / 12 (Self-Employed)
 * - Ratio = (New EMI + Existing EMIs) / Monthly Income × 100
 * - Eligible if Ratio <= 50%
 * - Recommends concrete maximum loan amount that keeps ratio <= 50%
 */
export function calculateEligibility(
  employment: EmploymentData,
  newEmi: number,
  annualRate: number,
  tenureMonths: number
): EligibilityResult {
  const existingEmis = Math.max(0, employment.existingEmis || 0);

  // Derive monthly income
  let monthlyIncome = 0;
  if (employment.employmentType === 'Salaried') {
    monthlyIncome = Math.max(0, employment.monthlySalary || 0);
  } else {
    const turnover = Math.max(0, employment.annualTurnover || 0);
    monthlyIncome = turnover / 12;
  }

  const totalObligations = newEmi + existingEmis;

  // Zero-income guard: prevent division by zero / NaN
  if (monthlyIncome <= 0) {
    return {
      monthlyIncome: 0,
      newEmi,
      existingEmis,
      totalObligations,
      ratio: totalObligations > 0 ? 100 : 0,
      isEligible: false,
      maxEligibleEmi: 0,
      maxEligibleLoanAmount: 0,
    };
  }

  const ratio = (totalObligations / monthlyIncome) * 100;
  const isEligible = ratio <= EMPLOYMENT_LIMITS.MAX_FOIR_RATIO;

  // Max total EMI allowed at 50% FOIR
  const maxTotalEmiAllowed = monthlyIncome * (EMPLOYMENT_LIMITS.MAX_FOIR_RATIO / 100);
  // Max new EMI applicant can take given their existing EMIs
  const maxEligibleEmi = Math.max(0, Math.floor(maxTotalEmiAllowed - existingEmis));

  // Compute maximum loan amount supported by maxEligibleEmi at current rate and tenure
  let maxEligibleLoanAmount = 0;
  if (maxEligibleEmi > 0 && tenureMonths > 0) {
    const r = annualRate / 12 / 100;
    if (r === 0) {
      maxEligibleLoanAmount = maxEligibleEmi * tenureMonths;
    } else {
      const rateFactor = Math.pow(1 + r, tenureMonths);
      maxEligibleLoanAmount = (maxEligibleEmi * (rateFactor - 1)) / (r * rateFactor);
    }

    // Round to nearest step (10,000) and clamp to bounds
    maxEligibleLoanAmount = Math.floor(maxEligibleLoanAmount / LOAN_LIMITS.STEP_AMOUNT) * LOAN_LIMITS.STEP_AMOUNT;
    maxEligibleLoanAmount = Math.min(LOAN_LIMITS.MAX_AMOUNT, Math.max(0, maxEligibleLoanAmount));
  }

  return {
    monthlyIncome: Math.round(monthlyIncome),
    newEmi: Math.round(newEmi),
    existingEmis: Math.round(existingEmis),
    totalObligations: Math.round(totalObligations),
    ratio: parseFloat(ratio.toFixed(1)),
    isEligible,
    maxEligibleEmi,
    maxEligibleLoanAmount,
  };
}
