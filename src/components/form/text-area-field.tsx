/**
 * TextAreaField
 *
 * Accessible, RHF-bound <textarea> with:
 * - an optional action slot beside the label (the AI "Help me write" button)
 * - label + ARIA error wiring and interaction-gated error display
 *
 * Used in:
 * - Step3Situation
 *
 * Depends on:
 * - React Hook Form (form context)
 * - FieldShell, useFieldError
 */
import { useFormContext, type FieldPath } from 'react-hook-form';
import type { ReactNode } from 'react';
import type { ApplicationData } from '@/features/wizard/schema';
import { FieldShell } from './field-shell';
import { useFieldError } from './use-field-error';

interface TextAreaFieldProps {
  name: FieldPath<ApplicationData>;
  label: string;
  rows?: number;
  /** Optional control rendered beside the label (the AI "Help me write" button). */
  action?: ReactNode;
}

const areaClass =
  'block w-full rounded-md border bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-brand-500 focus:ring-brand-500';

export function TextAreaField({ name, label, rows = 4, action }: TextAreaFieldProps) {
  const { register } = useFormContext<ApplicationData>();
  const errorKey = useFieldError(name);

  return (
    <FieldShell id={name} label={label} errorKey={errorKey} action={action}>
      {({ id, describedBy, invalid }) => (
        <textarea
          id={id}
          rows={rows}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          className={`${areaClass} ${invalid ? 'border-red-400' : 'border-slate-300'}`}
          {...register(name)}
        />
      )}
    </FieldShell>
  );
}
