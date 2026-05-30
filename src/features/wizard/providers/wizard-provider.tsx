/**
 * WizardProvider
 *
 * Holds a single React Hook Form instance for the whole application and shares
 * it (plus draft helpers) with the wizard subtree.
 *
 * Provides:
 * - cross-step form state with live (onChange) validation
 * - debounced LocalStorage draft persistence
 * - resume-draft detection (hadSavedDraft) and clearDraft()
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
import { DRAFT_STORAGE_KEY, emptyApplication } from '@/features/wizard/defaults';
import { debounce, readJson, remove, writeJson } from '@/utils/storage';

interface WizardContextValue {
  hadSavedDraft: boolean;
  clearDraft: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const WizardContext = createContext<WizardContextValue | null>(null);

export function WizardProvider({ children }: { children: ReactNode }) {
  const initial = useRef(readJson<ApplicationData>(DRAFT_STORAGE_KEY));
  const [hadSavedDraft] = useState(() => initial.current !== null);

  const methods = useForm<ApplicationData>({
    defaultValues: { ...emptyApplication, ...(initial.current ?? {}) },
    resolver: zodResolver(applicationSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  useEffect(() => {
    const save = debounce((data: ApplicationData) => {
      writeJson(DRAFT_STORAGE_KEY, data);
    });
    // eslint-disable-next-line react-hooks/incompatible-library -- RHF's watch() is an intentional subscription
    const subscription = methods.watch((data) => save(data as ApplicationData));
    return () => subscription.unsubscribe();
  }, [methods]);

  const value = useMemo<WizardContextValue>(
    () => ({
      hadSavedDraft,
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
