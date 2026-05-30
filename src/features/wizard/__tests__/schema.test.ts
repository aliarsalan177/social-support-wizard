import { describe, expect, it } from 'vitest';
import { step1Schema, step2Schema, step3Schema } from '@/features/wizard/schema';

const validStep1 = {
  name: 'Sara Ahmed',
  nationalId: '1234567890',
  dateOfBirth: '1990-01-01',
  gender: 'female',
  address: '12 Main St',
  city: 'Riyadh',
  state: 'Riyadh',
  country: 'Saudi Arabia',
  phone: '+966500000000',
  email: 'sara@example.com',
};

describe('step1Schema', () => {
  it('accepts a fully valid personal-info payload', () => {
    expect(step1Schema.safeParse(validStep1).success).toBe(true);
  });

  it('rejects an invalid email', () => {
    const result = step1Schema.safeParse({ ...validStep1, email: 'not-an-email' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('validation.email');
    }
  });

  it('rejects a future date of birth', () => {
    const result = step1Schema.safeParse({ ...validStep1, dateOfBirth: '2999-01-01' });
    expect(result.success).toBe(false);
  });

  it('rejects a non-numeric national id', () => {
    const result = step1Schema.safeParse({ ...validStep1, nationalId: 'ABC' });
    expect(result.success).toBe(false);
  });
});

describe('step2Schema', () => {
  it('accepts valid financial info', () => {
    const result = step2Schema.safeParse({
      maritalStatus: 'single',
      dependents: '0',
      employmentStatus: 'unemployed',
      monthlyIncome: '0',
      housingStatus: 'rented',
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty selects', () => {
    const result = step2Schema.safeParse({
      maritalStatus: '',
      dependents: '2',
      employmentStatus: 'employed',
      monthlyIncome: '5000',
      housingStatus: 'owned',
    });
    expect(result.success).toBe(false);
  });
});

describe('step3Schema', () => {
  it('requires a meaningful description', () => {
    const tooShort = step3Schema.safeParse({
      currentFinancialSituation: 'short',
      employmentCircumstances: 'short',
      reasonForApplying: 'short',
    });
    expect(tooShort.success).toBe(false);
  });

  it('accepts detailed descriptions', () => {
    const ok = step3Schema.safeParse({
      currentFinancialSituation: 'I am currently unemployed and struggling.',
      employmentCircumstances: 'I lost my job six months ago.',
      reasonForApplying: 'I need help covering rent and food.',
    });
    expect(ok.success).toBe(true);
  });
});
