import React from 'react';
import { useEmiCalculator } from '../hooks/useEmiCalculator';
import { LOAN_LIMITS } from '../constants';
import { SliderInput } from '../components/calculator/SliderInput';
import { EmiResults } from '../components/calculator/EmiResults';
import { BreakdownChart } from '../components/calculator/BreakdownChart';
import { AmortizationTable } from '../components/calculator/AmortizationTable';
import { Sparkles, ShieldCheck, Zap, Percent } from 'lucide-react';

export const HomePage: React.FC = () => {
  const {
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
  } = useEmiCalculator();

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          <span>Real-time Lending Intelligence</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Smarter Loan Decisions with <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-brand-600 to-accent-600 bg-clip-text text-transparent">
            Transparent EMI Planning
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Simulate your monthly installments, preview amortization schedules, check instant loan eligibility, and submit your application with zero hassle.
        </p>

        {/* Feature Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-semibold text-slate-700">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-slate-200 shadow-sm">
            <Zap className="w-3.5 h-3.5 text-accent-600" />
            <span>Instant Pre-approval Check</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-slate-200 shadow-sm">
            <Percent className="w-3.5 h-3.5 text-brand-600" />
            <span>Competitive Rates from 8%</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-slate-200 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Digital & Paperless</span>
          </span>
        </div>
      </section>

      {/* Main Interactive EMI Calculator Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Inputs */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex items-center justify-between pb-2">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Interactive EMI Calculator</h2>
              <p className="text-xs text-slate-500">
                Adjust sliders or enter numbers directly to simulate loan conditions.
              </p>
            </div>
          </div>

          {/* 1. Loan Amount */}
          <SliderInput
            label="Loan Amount"
            prefix="₹"
            value={amount}
            min={LOAN_LIMITS.MIN_AMOUNT}
            max={LOAN_LIMITS.MAX_AMOUNT}
            step={LOAN_LIMITS.STEP_AMOUNT}
            onChange={setAmount}
            onClampedChange={setClampedAmount}
            presets={[
              { label: '₹2 Lakh', value: 200000 },
              { label: '₹5 Lakh', value: 500000 },
              { label: '₹10 Lakh', value: 1000000 },
              { label: '₹15 Lakh', value: 1500000 },
              { label: '₹25 Lakh', value: 2500000 },
            ]}
          />

          {/* 2. Interest Rate */}
          <SliderInput
            label="Interest Rate (per annum)"
            unit="% p.a."
            value={rate}
            min={LOAN_LIMITS.MIN_RATE}
            max={LOAN_LIMITS.MAX_RATE}
            step={LOAN_LIMITS.STEP_RATE}
            onChange={setRate}
            onClampedChange={setClampedRate}
            presets={[
              { label: '8.5% (Prime)', value: 8.5 },
              { label: '10.5% (Standard)', value: 10.5 },
              { label: '12.0%', value: 12.0 },
              { label: '14.5%', value: 14.5 },
            ]}
          />

          {/* 3. Tenure */}
          <SliderInput
            label="Loan Tenure"
            unit="months"
            value={tenure}
            min={LOAN_LIMITS.MIN_TENURE}
            max={LOAN_LIMITS.MAX_TENURE}
            step={LOAN_LIMITS.STEP_TENURE}
            onChange={setTenure}
            onClampedChange={setClampedTenure}
            presets={[
              { label: '12 Months (1 Yr)', value: 12 },
              { label: '24 Months (2 Yrs)', value: 24 },
              { label: '36 Months (3 Yrs)', value: 36 },
              { label: '60 Months (5 Yrs)', value: 60 },
            ]}
          />
        </div>

        {/* Right Column: Live Outputs & Visual Breakdown */}
        <div className="lg:col-span-5 space-y-6">
          <EmiResults
            amount={amount}
            rate={rate}
            tenure={tenure}
            emiResult={emiResult}
          />

          {/* Principal vs Interest Donut Chart */}
          <BreakdownChart emiResult={emiResult} />
        </div>
      </section>

      {/* Amortization Schedule Accordion */}
      <section className="pt-4">
        <AmortizationTable schedule={schedule} />
      </section>
    </div>
  );
};
