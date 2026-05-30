/**
 * step-config
 *
 * Single source of truth for the wizard's steps: maps each step number to its
 * metadata (title i18n key) and the component to render. The page renders the
 * current step from this map instead of a chain of conditionals, and the
 * progress bar reads its titles from here too.
 *
 * Used in:
 * - WizardPage (renders the active step)
 * - ProgressBar (step title)
 */
import type { ComponentType } from 'react';
import { Step1Personal } from './step-1-personal';
import { Step2Family } from './step-2-family';
import { Step3Situation } from './step-3-situation';

export interface WizardStep {
  number: number;
  /** i18n key for the step's title. */
  titleKey: 'steps.personal' | 'steps.family' | 'steps.situation';
  /** The form section rendered for this step. */
  Component: ComponentType;
}

export type StepNumber = 1 | 2 | 3;

export const STEP_MAP: Record<StepNumber, WizardStep> = {
  1: { number: 1, titleKey: 'steps.personal', Component: Step1Personal },
  2: { number: 2, titleKey: 'steps.family', Component: Step2Family },
  3: { number: 3, titleKey: 'steps.situation', Component: Step3Situation },
};
