/**
 * TextField
 *
 * Accessible, RHF-bound text input with:
 * - label + ARIA error wiring (via FieldShell)
 * - live error display gated by interaction (via useFieldError)
 *
 * Used in:
 * - Step1Personal, Step2Family
 *
 * Depends on:
 * - React Hook Form (form context)
 * - FieldShell, useFieldError
 */
import { useFormContext, type FieldPath } from 'react-hook-form';
import type { HTMLInputTypeAttribute } from 'react';
import type { ApplicationData } from '@/features/wizard/schema';
import { FieldShell } from './field-shell';
import { useFieldError } from './use-field-error';

interface TextFieldProps {
  name: FieldPath<ApplicationData>;
  label: string;
  type?: HTMLInputTypeAttribute;
  autoComplete?: string;
  inputMode?: 'text' | 'numeric' | 'tel' | 'email';
}

const inputClass =
  'block w-full rounded-md border bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-brand-500 focus:ring-brand-500';

export function TextField({ name, label, type = 'text', autoComplete, inputMode }: TextFieldProps) {
  const { register } = useFormContext<ApplicationData>();
  const errorKey = useFieldError(name);

  return (
    <FieldShell id={name} label={label} errorKey={errorKey}>
      {({ id, describedBy, invalid }) => (
        <input
          id={id}
          type={type}
          inputMode={inputMode}
          autoComplete={autoComplete}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          className={`${inputClass} ${invalid ? 'border-red-400' : 'border-slate-300'}`}
          {...register(name)}
        />
      )}
    </FieldShell>
  );
}
