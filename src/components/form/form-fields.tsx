/**
 * FormFields
 *
 * Renders a list of form fields from a config array instead of repeating
 * <TextField> / <SelectField> markup. Each field's label is derived from its
 * name (`fields.<name>`), and `fullWidth` spans both grid columns.
 *
 * Used in:
 * - Step1Personal, Step2Family
 *
 * Depends on:
 * - TextField, SelectField
 */
import { useTranslation } from 'react-i18next';
import type { FieldPath } from 'react-hook-form';
import type { HTMLInputTypeAttribute } from 'react';
import type { ApplicationData } from '@/features/wizard/schema';
import { TextField } from './text-field';
import { SelectField } from './select-field';

interface SelectOption {
  value: string;
  /** i18n key for the option label. */
  labelKey: string;
}

interface BaseFieldConfig {
  name: FieldPath<ApplicationData>;
  /** Span both columns of the grid. */
  fullWidth?: boolean;
}

export interface TextFieldConfig extends BaseFieldConfig {
  kind: 'text';
  type?: HTMLInputTypeAttribute;
  autoComplete?: string;
  inputMode?: 'text' | 'numeric' | 'tel' | 'email';
}

export interface SelectFieldConfig extends BaseFieldConfig {
  kind: 'select';
  options: SelectOption[];
}

export type FieldConfig = TextFieldConfig | SelectFieldConfig;

export function FormFields({ fields }: { fields: FieldConfig[] }) {
  const { t } = useTranslation();

  return (
    <>
      {fields.map((field) => {
        const label = t(`fields.${field.name}`);
        return (
          <div
            key={field.name}
            className={field.fullWidth ? 'sm:col-span-2' : undefined}
          >
            {field.kind === 'select' ? (
              <SelectField name={field.name} label={label} options={field.options} />
            ) : (
              <TextField
                name={field.name}
                label={label}
                type={field.type}
                autoComplete={field.autoComplete}
                inputMode={field.inputMode}
              />
            )}
          </div>
        );
      })}
    </>
  );
}
