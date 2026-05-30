import { z } from 'zod';

/*
 * One Zod schema per step. Validation messages are i18n KEYS — the Field
 * component runs them through t(), so errors are localized automatically.
 * The schemas are the single source of truth: React Hook Form validates
 * with them AND our form types are inferred from them (z.infer).
 */

const required = { message: 'validation.required' };

const digits = (msg: string) =>
  z.string().min(1, required).regex(/^\d+$/, { message: msg });

export const step1Schema = z.object({
  name: z.string().min(1, required),
  nationalId: digits('validation.nationalId'),
  dateOfBirth: z
    .string()
    .min(1, required)
    .refine((value) => new Date(value) < new Date(), {
      message: 'validation.pastDate',
    }),
  gender: z.enum(['male', 'female', 'other'], required),
  address: z.string().min(1, required),
  city: z.string().min(1, required),
  state: z.string().min(1, required),
  country: z.string().min(1, required),
  phone: z
    .string()
    .min(1, required)
    .regex(/^[+]?[\d\s-]{7,15}$/, { message: 'validation.phone' }),
  email: z.string().min(1, required).pipe(z.email({ message: 'validation.email' })),
});

export const step2Schema = z.object({
  maritalStatus: z.enum(
    ['single', 'married', 'divorced', 'widowed'],
    required,
  ),
  dependents: digits('validation.min0'),
  employmentStatus: z.enum(
    ['employed', 'unemployed', 'selfEmployed', 'student', 'retired'],
    required,
  ),
  monthlyIncome: digits('validation.min0'),
  housingStatus: z.enum(
    ['owned', 'rented', 'withFamily', 'homeless'],
    required,
  ),
});

export const step3Schema = z.object({
  currentFinancialSituation: z.string().min(10, { message: 'validation.tooShort' }),
  employmentCircumstances: z.string().min(10, { message: 'validation.tooShort' }),
  reasonForApplying: z.string().min(10, { message: 'validation.tooShort' }),
});

/** Full application = all three steps merged. */
export const applicationSchema = step1Schema
  .extend(step2Schema.shape)
  .extend(step3Schema.shape);

export type Step1Values = z.infer<typeof step1Schema>;
export type Step2Values = z.infer<typeof step2Schema>;
export type Step3Values = z.infer<typeof step3Schema>;
export type ApplicationData = z.infer<typeof applicationSchema>;

/** One schema per step, indexed by step number for the wizard. */
export const stepSchemas = {
  1: step1Schema,
  2: step2Schema,
  3: step3Schema,
} as const;

/** Field names per step — used by RHF's `trigger()` to validate one step. */
export const stepFields = {
  1: Object.keys(step1Schema.shape) as (keyof Step1Values)[],
  2: Object.keys(step2Schema.shape) as (keyof Step2Values)[],
  3: Object.keys(step3Schema.shape) as (keyof Step3Values)[],
} as const;

export const TOTAL_STEPS = 3;
