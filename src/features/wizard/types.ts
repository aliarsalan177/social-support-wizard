/** Flat application payload sent to the API after flattening the Formwright nested values. */
export interface ApplicationData {
  name: string;
  nationalId: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other' | '';
  address: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  email: string;
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed' | '';
  dependents: string;
  employmentStatus: 'employed' | 'unemployed' | 'selfEmployed' | 'student' | 'retired' | '';
  monthlyIncome: string;
  housingStatus: 'owned' | 'rented' | 'withFamily' | 'homeless' | '';
  currentFinancialSituation: string;
  employmentCircumstances: string;
  reasonForApplying: string;
}
