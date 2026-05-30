import { useContext } from 'react';
import { WizardContext } from '@/features/wizard/providers/wizard-provider';

/** Access wizard-level state (draft status). Must be used within WizardProvider. */
export function useWizard() {
  const ctx = useContext(WizardContext);
  if (!ctx) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return ctx;
}
