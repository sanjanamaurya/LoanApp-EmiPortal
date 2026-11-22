import { z } from 'zod';
import { INDIAN_PHONE_REGEX, NAME_REGEX } from '../utils/validators';
import { PAN_REGEX } from '../utils/pan';
import { isValidAge } from '../utils/date';

export const applicantSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, 'Full name must be at least 3 characters long')
    .max(60, 'Full name cannot exceed 60 characters')
    .regex(NAME_REGEX, 'Name should contain letters, spaces, hyphens, and apostrophes only'),
  phone: z
    .string()
    .trim()
    .regex(INDIAN_PHONE_REGEX, 'Enter a valid 10-digit Indian mobile number starting with 6-9'),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address'),
  pan: z
    .string()
    .trim()
    .toUpperCase()
    .regex(PAN_REGEX, 'Invalid PAN format. Must be 5 letters, 4 digits, 1 letter (e.g. ABCDE1234F)'),
  dob: z
    .string()
    .min(1, 'Date of birth is required')
    .refine((dob) => isValidAge(dob).valid, {
      message: 'Applicant must be between 21 and 70 years old',
    }),
});

export type ApplicantFormValues = z.infer<typeof applicantSchema>;
