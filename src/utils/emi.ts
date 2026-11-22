import { AmortizationRow, EmiCalculationResult } from '../types';

/**
 * Calculates Monthly EMI, Total Interest, and Total Payable.
 * 
 * Formula:
 * EMI = [P × r × (1 + r)^n] / [(1 + r)^n - 1]
 * where:
 * P = Principal loan amount
 * r = Monthly interest rate (annualRate / 12 / 100)
 * n = Tenure in months
 * 
 * Edge case: If r = 0, EMI = P / n.
 */
export function calculateEmi(
  principal: number,
  annualRate: number,
  tenureMonths: number
): EmiCalculationResult {
  if (principal <= 0 || tenureMonths <= 0) {
    return {
      monthlyEmi: 0,
      totalInterest: 0,
      totalAmount: 0,
      principal: Math.max(0, principal),
    };
  }

  // Monthly interest rate
  const r = annualRate / 12 / 100;

  let emi: number;
  if (r === 0) {
    emi = principal / tenureMonths;
  } else {
    const rateFactor = Math.pow(1 + r, tenureMonths);
    emi = (principal * r * rateFactor) / (rateFactor - 1);
  }

  const roundedEmi = Math.round(emi);
  const totalAmount = roundedEmi * tenureMonths;
  const totalInterest = Math.max(0, totalAmount - principal);

  return {
    monthlyEmi: roundedEmi,
    totalInterest,
    totalAmount,
    principal,
  };
}

/**
 * Generates month-by-month amortization schedule.
 * Guarantees:
 * - balance never negative
 * - final month balance is exactly 0
 * - adjustments made to the final installment for rounding accuracy
 */
export function generateAmortizationSchedule(
  principal: number,
  annualRate: number,
  tenureMonths: number
): AmortizationRow[] {
  if (principal <= 0 || tenureMonths <= 0) return [];

  const r = annualRate / 12 / 100;
  const { monthlyEmi } = calculateEmi(principal, annualRate, tenureMonths);
  const schedule: AmortizationRow[] = [];

  let currentBalance = principal;

  for (let month = 1; month <= tenureMonths; month++) {
    const openingBalance = currentBalance;
    const interest = r === 0 ? 0 : Math.round(openingBalance * r);

    let principalPayment: number;
    let emiPayment: number;
    let remainingBalance: number;

    if (month === tenureMonths) {
      // Last month: remaining balance must hit exactly 0
      principalPayment = openingBalance;
      emiPayment = principalPayment + interest;
      remainingBalance = 0;
    } else {
      principalPayment = Math.min(openingBalance, monthlyEmi - interest);
      emiPayment = monthlyEmi;
      remainingBalance = Math.max(0, openingBalance - principalPayment);
    }

    currentBalance = remainingBalance;

    schedule.push({
      month,
      openingBalance,
      emi: emiPayment,
      principal: principalPayment,
      interest,
      remainingBalance,
    });
  }

  return schedule;
}
