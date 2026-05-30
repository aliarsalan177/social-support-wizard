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

/** True if the data has at least one filled field (i.e. worth persisting/resuming). */
export function hasApplicationData(
  data: Partial<ApplicationData> | null | undefined,
): boolean {
  if (!data) return false;
  return Object.values(data).some(
    (value) => typeof value === 'string' && value.trim() !== '',
  );
}
