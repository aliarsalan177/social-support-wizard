/**
 * SelectField
 *
 * Accessible, RHF-bound <select> with:
 * - a disabled placeholder option
 * - localized option labels (i18n keys)
 * - label + ARIA error wiring and interaction-gated error display
 *
 * Used in:
 * - Step1Personal, Step2Family
 *
 * Depends on:
 * - React Hook Form (form context)
 * - FieldShell, useFieldError, react-i18next
 */
import { useFormContext, type FieldPath } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { ApplicationData } from '@/features/wizard/schema';
import { FieldShell } from './field-shell';
import { useFieldError } from './use-field-error';

interface SelectOption {
  value: string;
  /** i18n key for the option label. */
  labelKey: string;
}

interface SelectFieldProps {
  name: FieldPath<ApplicationData>;
  label: string;
  options: SelectOption[];
}

const selectClass =
  'block w-full rounded-md border bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-brand-500 focus:ring-brand-500';

export function SelectField({ name, label, options }: SelectFieldProps) {
  const { t } = useTranslation();
  const { register } = useFormContext<ApplicationData>();
  const errorKey = useFieldError(name);

  return (
    <FieldShell id={name} label={label} errorKey={errorKey}>
      {({ id, describedBy, invalid }) => (
        <select
          id={id}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          defaultValue=""
          className={`${selectClass} ${invalid ? 'border-red-400' : 'border-slate-300'}`}
          {...register(name)}
        >
          <option value="" disabled>
            {t('placeholders.select')}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {t(opt.labelKey as never)}
            </option>
          ))}
        </select>
      )}
    </FieldShell>
  );
}
