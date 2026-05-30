/**
 * WizardPage
 *
 * Renders the current step of the application wizard with:
 * - a progress bar
 * - per-step validation on "Next" (full-schema validation on submit)
 * - a resume-draft banner
 * - a success screen after submission
 *
 * The active step is driven by the `:step` route param.
 *
 * Used in:
 * - Wizard (route element)
 *
 * Depends on:
 * - React Hook Form (shared form context)
 * - React Router (useParams / useNavigate)
 * - Zod step schemas
 * - useWizard, useSubmitApplication
 */
import { useState, type FormEvent } from 'react';
import { useFormContext } from 'react-hook-form';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ProgressBar } from './components/progress-bar';
import { StepNav } from './components/step-nav';
import { ResumeBanner } from './components/resume-banner';
import { SuccessScreen } from './components/success-screen';
import { STEP_MAP, type StepNumber } from './steps/step-config';
import { stepFields, stepSchemas, TOTAL_STEPS, type ApplicationData } from './schema';
import { useWizard } from './hooks/use-wizard';
import { useSubmitApplication } from './hooks/use-submit-application';

function clampStep(raw: string | undefined): number {
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1) return 1;
  if (n > TOTAL_STEPS) return TOTAL_STEPS;
  return n;
}

/**
 * The furthest step the user may access: every earlier step must validate
 * first. Returns the first step that fails, or the last step when all pass.
 */
function maxReachableStep(values: ApplicationData): StepNumber {
  for (let s = 1; s <= TOTAL_STEPS; s++) {
    if (!stepSchemas[s as StepNumber].safeParse(values).success) {
      return s as StepNumber;
    }
  }
  return TOTAL_STEPS;
}

export function WizardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { step: stepParam } = useParams();
  const step = clampStep(stepParam) as StepNumber;
  const { Component: StepComponent } = STEP_MAP[step];

  const { handleSubmit, trigger, getValues, setValue } =
    useFormContext<ApplicationData>();
  const { hadSavedDraft, resumeDraft, clearDraft } = useWizard();
  const { submit, isSubmitting, isSuccess, isError, result } =
    useSubmitApplication();

  const [showResume, setShowResume] = useState(hadSavedDraft);

  const isFirst = step === 1;
  const isLast = step === TOTAL_STEPS;

  const goToStep = (n: number) => navigate(`/apply/step/${n}`);

  const handleResume = () => {
    resumeDraft();
    setShowResume(false);
  };

  const handleDiscard = () => {
    clearDraft();
    setShowResume(false);
    goToStep(1);
  };

  const handleBack = () => goToStep(step - 1);

  // Final submit: persist the application and clear the saved draft.
  const handleValidSubmit = async (data: ApplicationData) => {
    const res = await submit(data);
    if (res) clearDraft();
  };

  // Mark the current step's fields touched so any errors become visible,
  // even for fields the user hasn't interacted with yet.
  const revealStepErrors = () => {
    for (const field of stepFields[step]) {
      setValue(field, getValues(field), { shouldTouch: true });
    }
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isLast) {
      await handleSubmit(handleValidSubmit)();
      return;
    }
    revealStepErrors();
    const valid = await trigger(stepFields[step]);
    if (valid) goToStep(step + 1);
  };

  if (isSuccess && result) {
    return <SuccessScreen referenceNumber={result.referenceNumber} />;
  }

  // Block deep-linking past incomplete steps: send the user back to the
  // first step they still need to complete.
  const reachable = maxReachableStep(getValues());
  if (step > reachable) {
    return <Navigate to={`/apply/step/${reachable}`} replace />;
  }

  return (
    <div>
      {showResume && (
        <ResumeBanner onResume={handleResume} onDiscard={handleDiscard} />
      )}
      <ProgressBar current={step} />
      <form onSubmit={handleFormSubmit} noValidate>
        <StepComponent />
        {isError && (
          <p role="alert" className="mt-4 text-sm text-red-600">
            {t('submit.error')}
          </p>
        )}
        <StepNav
          isFirst={isFirst}
          isLast={isLast}
          isSubmitting={isSubmitting}
          onBack={handleBack}
        />
      </form>
    </div>
  );
}
