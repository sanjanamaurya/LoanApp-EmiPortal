import { useState, useMemo, useCallback } from 'react';
import { LOAN_LIMITS } from '../constants';
import { calculateEmi, generateAmortizationSchedule } from '../utils/emi';
import { LoanDetails } from '../types';

export function useEmiCalculator(initialDetails?: Partial<LoanDetails>) {
  const [amount, setAmount] = useState<number>(initialDetails?.amount ?? LOAN_LIMITS.DEFAULT_AMOUNT);
  const [rate, setRate] = useState<number>(initialDetails?.rate ?? LOAN_LIMITS.DEFAULT_RATE);
  const [tenure, setTenure] = useState<number>(initialDetails?.tenure ?? LOAN_LIMITS.DEFAULT_TENURE);

  const emiResult = useMemo(() => {
    return calculateEmi(amount, rate, tenure);
  }, [amount, rate, tenure]);

  const schedule = useMemo(() => {
    return generateAmortizationSchedule(amount, rate, tenure);
  }, [amount, rate, tenure]);

  const setClampedAmount = useCallback((val: number) => {
    const clamped = Math.min(LOAN_LIMITS.MAX_AMOUNT, Math.max(LOAN_LIMITS.MIN_AMOUNT, val));
    setAmount(clamped);
  }, []);

  const setClampedRate = useCallback((val: number) => {
    const clamped = Math.min(LOAN_LIMITS.MAX_RATE, Math.max(LOAN_LIMITS.MIN_RATE, val));
    setRate(parseFloat(clamped.toFixed(1)));
  }, []);

  const setClampedTenure = useCallback((val: number) => {
    const clamped = Math.min(LOAN_LIMITS.MAX_TENURE, Math.max(LOAN_LIMITS.MIN_TENURE, Math.round(val)));
    setTenure(clamped);
  }, []);

  return {
    amount,
    rate,
    tenure,
    setAmount,
    setRate,
    setTenure,
    setClampedAmount,
    setClampedRate,
    setClampedTenure,
    emiResult,
    schedule,
  };
}
