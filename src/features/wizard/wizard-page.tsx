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
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ProgressBar } from './components/progress-bar';
import { StepNav } from './components/step-nav';
import { ResumeBanner } from './components/resume-banner';
import { SuccessScreen } from './components/success-screen';
import { STEP_MAP, type StepNumber } from './steps/step-config';
import { stepFields, TOTAL_STEPS, type ApplicationData } from './schema';
import { useWizard } from './hooks/use-wizard';
import { useSubmitApplication } from './hooks/use-submit-application';

function clampStep(raw: string | undefined): number {
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1) return 1;
  if (n > TOTAL_STEPS) return TOTAL_STEPS;
  return n;
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

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isLast) {
      // Final submit validates the entire application schema.
      await handleSubmit(async (data) => {
        const res = await submit(data);
        if (res) clearDraft();
      })();
      return;
    }
    // Advancing only validates the current step's fields. Mark them touched
    // first so any errors become visible even for fields not yet interacted with.
    const fields = stepFields[step];
    fields.forEach((field) =>
      setValue(field, getValues(field), { shouldTouch: true }),
    );
    const valid = await trigger(fields);
    if (valid) goToStep(step + 1);
  };

  if (isSuccess && result) {
    return <SuccessScreen referenceNumber={result.referenceNumber} />;
  }

  return (
    <div>
      {showResume && (
        <ResumeBanner
          onResume={() => {
            resumeDraft();
            setShowResume(false);
          }}
          onDiscard={() => {
            clearDraft();
            setShowResume(false);
            goToStep(1);
          }}
        />
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
          onBack={() => goToStep(step - 1)}
        />
      </form>
    </div>
  );
}
