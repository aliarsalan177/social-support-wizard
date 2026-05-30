import { useTranslation } from 'react-i18next';
import type { ReactNode } from 'react';

interface FieldShellProps {
  id: string;
  label: string;
  /** i18n key of the validation error, if any. */
  errorKey?: string;
  children: (props: { id: string; describedBy?: string; invalid: boolean }) => ReactNode;
}

/**
 * Layout + accessibility wrapper shared by every field: associates the
 * label, exposes the error via aria-describedby, and announces it politely.
 */
export function FieldShell({ id, label, errorKey, children }: FieldShellProps) {
  const { t } = useTranslation();
  const errorId = `${id}-error`;
  const invalid = Boolean(errorKey);

  return (
    <div className="text-start">
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </label>
      {children({ id, describedBy: invalid ? errorId : undefined, invalid })}
      {invalid && (
        <p id={errorId} role="alert" className="mt-1 text-sm text-red-600">
          {/* errorKey is always a valid translation key from the Zod schema */}
          {t(errorKey as never)}
        </p>
      )}
    </div>
  );
}
