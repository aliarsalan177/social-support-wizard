import { useTranslation } from 'react-i18next';
import { FormFields, type FieldConfig } from '@/components/form/form-fields';

const FIELDS: FieldConfig[] = [
  { kind: 'text', name: 'name', autoComplete: 'name' },
  { kind: 'text', name: 'nationalId', inputMode: 'numeric' },
  { kind: 'text', name: 'dateOfBirth', type: 'date', autoComplete: 'bday' },
  {
    kind: 'select',
    name: 'gender',
    options: [
      { value: 'male', labelKey: 'options.gender.male' },
      { value: 'female', labelKey: 'options.gender.female' },
      { value: 'other', labelKey: 'options.gender.other' },
    ],
  },
  { kind: 'text', name: 'address', autoComplete: 'street-address', fullWidth: true },
  { kind: 'text', name: 'city', autoComplete: 'address-level2' },
  { kind: 'text', name: 'state', autoComplete: 'address-level1' },
  { kind: 'text', name: 'country', autoComplete: 'country-name' },
  { kind: 'text', name: 'phone', type: 'tel', inputMode: 'tel', autoComplete: 'tel' },
  {
    kind: 'text',
    name: 'email',
    type: 'email',
    inputMode: 'email',
    autoComplete: 'email',
    fullWidth: true,
  },
];

export function Step1Personal() {
  const { t } = useTranslation();
  return (
    <fieldset className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <legend className="sr-only">{t('steps.personal')}</legend>
      <FormFields fields={FIELDS} />
    </fieldset>
  );
}
