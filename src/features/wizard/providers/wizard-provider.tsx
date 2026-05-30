/**
 * WizardProvider
 *
 * Holds a single React Hook Form instance for the whole application and shares
 * it (plus draft helpers) with the wizard subtree.
 *
 * Provides:
 * - cross-step form state with live (onChange) validation
 * - resume-draft detection (hadSavedDraft) + resumeDraft() to autofill
 * - persistence that stores filled data and clears storage when emptied
 *
 * The form starts EMPTY: a saved draft is only loaded into it when the user
 * explicitly resumes. If they don't resume and start filling, the new data
 * overwrites any stale draft automatically.
 *
 * Used in:
 * - Wizard
 *
 * Depends on:
 * - React Hook Form + Zod resolver
 * - storage utils (LocalStorage)
 */
import { createContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { applicationSchema, type ApplicationData } from '@/features/wizard/schema';
import {
  DRAFT_STORAGE_KEY,
  emptyApplication,
  hasApplicationData,
} from '@/features/wizard/defaults';
import { debounce, readJson, remove, writeJson } from '@/utils/storage';

interface WizardContextValue {
  /** A non-empty draft existed on this device when the app loaded. */
  hadSavedDraft: boolean;
  /** Load the saved draft into the form (autofill). */
  resumeDraft: () => void;
  /** Wipe the persisted draft and reset the form to empty. */
  clearDraft: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const WizardContext = createContext<WizardContextValue | null>(null);

export function WizardProvider({ children }: { children: ReactNode }) {
  // Read any saved draft once, at mount, but DON'T load it into the form yet.
  const draft = useRef(readJson<ApplicationData>(DRAFT_STORAGE_KEY));
  const [hadSavedDraft] = useState(() => hasApplicationData(draft.current));

  const methods = useForm<ApplicationData>({
    defaultValues: emptyApplication,
    resolver: zodResolver(applicationSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  // Persist on change: store the data when it has content, otherwise clear the
  // key. This means starting fresh (without resuming) overwrites a stale draft,
  // and emptying / discarding the form removes it from storage.
  useEffect(() => {
    const persist = debounce((data: ApplicationData) => {
      if (hasApplicationData(data)) {
        writeJson(DRAFT_STORAGE_KEY, data);
      } else {
        remove(DRAFT_STORAGE_KEY);
      }
    });
    // eslint-disable-next-line react-hooks/incompatible-library -- RHF's watch() is an intentional subscription
    const subscription = methods.watch((data) => persist(data as ApplicationData));
    return () => subscription.unsubscribe();
  }, [methods]);

  const value = useMemo<WizardContextValue>(
    () => ({
      hadSavedDraft,
      resumeDraft: () => {
        if (draft.current) methods.reset(draft.current);
      },
      clearDraft: () => {
        remove(DRAFT_STORAGE_KEY);
        methods.reset(emptyApplication);
      },
    }),
    [hadSavedDraft, methods],
  );

  return (
    <WizardContext.Provider value={value}>
      <FormProvider {...methods}>{children}</FormProvider>
    </WizardContext.Provider>
  );
}
