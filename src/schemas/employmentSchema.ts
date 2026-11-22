import { z } from 'zod';
import { EMPLOYMENT_LIMITS } from '../constants';

export const employmentSchema = z
  .object({
    employmentType: z.enum(['Salaried', 'Self-Employed']),
    companyName: z.string().optional(),
    monthlySalary: z.number().optional(),
    businessName: z.string().optional(),
    annualTurnover: z.number().optional(),
    existingEmis: z.number().min(0, 'Existing EMIs cannot be negative').default(0),
  })
  .superRefine((data, ctx) => {
    if (data.employmentType === 'Salaried') {
      if (!data.companyName || data.companyName.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['companyName'],
          message: 'Company name must be at least 2 characters long',
        });
      }
      if (data.monthlySalary === undefined || isNaN(data.monthlySalary) || data.monthlySalary < EMPLOYMENT_LIMITS.MIN_SALARY) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['monthlySalary'],
          message: `Monthly salary must be at least ₹${EMPLOYMENT_LIMITS.MIN_SALARY.toLocaleString('en-IN')}`,
        });
      }
    } else if (data.employmentType === 'Self-Employed') {
      if (!data.businessName || data.businessName.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['businessName'],
          message: 'Business name is required',
        });
      }
      if (data.annualTurnover === undefined || isNaN(data.annualTurnover) || data.annualTurnover < EMPLOYMENT_LIMITS.MIN_TURNOVER) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['annualTurnover'],
          message: `Annual turnover must be at least ₹${EMPLOYMENT_LIMITS.MIN_TURNOVER.toLocaleString('en-IN')}`,
        });
      }
    }
  });

export type EmploymentFormValues = z.infer<typeof employmentSchema>;
