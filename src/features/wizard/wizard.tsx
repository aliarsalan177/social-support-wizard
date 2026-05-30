/**
 * Wizard
 *
 * Public entry point for the 3-step social-support application feature.
 * Composes the form-state provider around the page, and stays mounted across
 * step param changes so progress is preserved.
 *
 * Provides:
 * - shared multi-step form state
 * - LocalStorage draft persistence
 *
 * Used in:
 * - App routes (/apply/step/:step)
 *
 * Depends on:
 * - WizardProvider
 * - WizardPage
 */
import { WizardProvider } from './providers/wizard-provider';
import { WizardPage } from './wizard-page';

export function Wizard() {
  return (
    <WizardProvider>
      <WizardPage />
    </WizardProvider>
  );
}
