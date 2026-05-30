/**
 * TextAreaField
 *
 * Accessible, RHF-bound <textarea> with:
 * - an optional action rendered INSIDE the field at the bottom-end corner
 *   (the AI "Help me write" button, like LinkedIn's inline AI assistant)
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
  /** Optional control rendered inside the field, pinned to the bottom-end. */
  action?: ReactNode;
}

const areaClass =
  'block w-full rounded-md border bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-brand-500 focus:ring-brand-500';

export function TextAreaField({ name, label, rows = 4, action }: TextAreaFieldProps) {
  const { register } = useFormContext<ApplicationData>();
  const errorKey = useFieldError(name);

  return (
    <FieldShell id={name} label={label} errorKey={errorKey}>
      {({ id, describedBy, invalid }) => (
        <div className="relative">
          <textarea
            id={id}
            rows={rows}
            aria-invalid={invalid}
            aria-describedby={describedBy}
            // Reserve space at the bottom so typed text never sits under the action.
            className={`${areaClass} ${action ? 'pb-12' : ''} ${invalid ? 'border-red-400' : 'border-slate-300'}`}
            {...register(name)}
          />
          {action && <div className="absolute bottom-2 end-2">{action}</div>}
        </div>
      )}
    </FieldShell>
  );
}
