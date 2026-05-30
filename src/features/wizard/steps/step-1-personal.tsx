import { useTranslation } from 'react-i18next';
import { TextField } from '@/components/form/text-field';
import { SelectField } from '@/components/form/select-field';

const GENDER_OPTIONS = [
  { value: 'male', labelKey: 'options.gender.male' },
  { value: 'female', labelKey: 'options.gender.female' },
  { value: 'other', labelKey: 'options.gender.other' },
];

export function Step1Personal() {
  const { t } = useTranslation();
  return (
    <fieldset className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <legend className="sr-only">{t('steps.personal')}</legend>

      <TextField name="name" label={t('fields.name')} autoComplete="name" />
      <TextField name="nationalId" label={t('fields.nationalId')} inputMode="numeric" />
      <TextField name="dateOfBirth" label={t('fields.dateOfBirth')} type="date" autoComplete="bday" />
      <SelectField name="gender" label={t('fields.gender')} options={GENDER_OPTIONS} />

      <div className="sm:col-span-2">
        <TextField name="address" label={t('fields.address')} autoComplete="street-address" />
      </div>

      <TextField name="city" label={t('fields.city')} autoComplete="address-level2" />
      <TextField name="state" label={t('fields.state')} autoComplete="address-level1" />
      <TextField name="country" label={t('fields.country')} autoComplete="country-name" />
      <TextField name="phone" label={t('fields.phone')} type="tel" inputMode="tel" autoComplete="tel" />

      <div className="sm:col-span-2">
        <TextField name="email" label={t('fields.email')} type="email" inputMode="email" autoComplete="email" />
      </div>
    </fieldset>
  );
}
