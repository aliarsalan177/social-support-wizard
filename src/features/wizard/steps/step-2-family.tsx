import { useTranslation } from 'react-i18next';
import { TextField } from '@/components/form/text-field';
import { SelectField } from '@/components/form/select-field';

const MARITAL_OPTIONS = [
  { value: 'single', labelKey: 'options.maritalStatus.single' },
  { value: 'married', labelKey: 'options.maritalStatus.married' },
  { value: 'divorced', labelKey: 'options.maritalStatus.divorced' },
  { value: 'widowed', labelKey: 'options.maritalStatus.widowed' },
];

const EMPLOYMENT_OPTIONS = [
  { value: 'employed', labelKey: 'options.employmentStatus.employed' },
  { value: 'unemployed', labelKey: 'options.employmentStatus.unemployed' },
  { value: 'selfEmployed', labelKey: 'options.employmentStatus.selfEmployed' },
  { value: 'student', labelKey: 'options.employmentStatus.student' },
  { value: 'retired', labelKey: 'options.employmentStatus.retired' },
];

const HOUSING_OPTIONS = [
  { value: 'owned', labelKey: 'options.housingStatus.owned' },
  { value: 'rented', labelKey: 'options.housingStatus.rented' },
  { value: 'withFamily', labelKey: 'options.housingStatus.withFamily' },
  { value: 'homeless', labelKey: 'options.housingStatus.homeless' },
];

export function Step2Family() {
  const { t } = useTranslation();
  return (
    <fieldset className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <legend className="sr-only">{t('steps.family')}</legend>

      <SelectField name="maritalStatus" label={t('fields.maritalStatus')} options={MARITAL_OPTIONS} />
      <TextField name="dependents" label={t('fields.dependents')} inputMode="numeric" />
      <SelectField name="employmentStatus" label={t('fields.employmentStatus')} options={EMPLOYMENT_OPTIONS} />
      <TextField name="monthlyIncome" label={t('fields.monthlyIncome')} inputMode="numeric" />

      <div className="sm:col-span-2">
        <SelectField name="housingStatus" label={t('fields.housingStatus')} options={HOUSING_OPTIONS} />
      </div>
    </fieldset>
  );
}
