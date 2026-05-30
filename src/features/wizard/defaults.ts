import type { ApplicationData } from './schema';

/** Empty starting values for the whole form (all fields controlled). */
export const emptyApplication: ApplicationData = {
  name: '',
  nationalId: '',
  dateOfBirth: '',
  gender: '' as ApplicationData['gender'],
  address: '',
  city: '',
  state: '',
  country: '',
  phone: '',
  email: '',
  maritalStatus: '' as ApplicationData['maritalStatus'],
  dependents: '',
  employmentStatus: '' as ApplicationData['employmentStatus'],
  monthlyIncome: '',
  housingStatus: '' as ApplicationData['housingStatus'],
  currentFinancialSituation: '',
  employmentCircumstances: '',
  reasonForApplying: '',
};

export const DRAFT_STORAGE_KEY = 'social-support-wizard:draft';
