import { useFormContext, type FieldPath } from 'react-hook-form';
import type { ApplicationData } from '@/features/wizard/schema';

/**
 * Returns the active validation error (i18n key) for a field, but only once
 * the user has interacted with it (dirty/touched) or a step advance / submit
 * has been attempted. This keeps live `onChange` validation from flagging
 * every still-untouched field the moment one field is typed into.
 */
export function useFieldError(
  name: FieldPath<ApplicationData>,
): string | undefined {
  const {
    formState: { errors, touchedFields, dirtyFields, isSubmitted },
  } = useFormContext<ApplicationData>();

  const touched = Boolean((touchedFields as Record<string, unknown>)[name]);
  const dirty = Boolean((dirtyFields as Record<string, unknown>)[name]);
  if (!touched && !dirty && !isSubmitted) return undefined;

  return errors[name]?.message as string | undefined;
}
