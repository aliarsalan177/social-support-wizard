import { useTranslation } from 'react-i18next';

interface StepNavProps {
  isFirst: boolean;
  isLast: boolean;
  isSubmitting: boolean;
  /** Whether the current step is valid (enables Next/Submit). */
  canProceed: boolean;
  onBack: () => void;
}

/**
 * Back / Next / Submit controls. The Next/Submit button is type="submit"
 * so it participates in the step <form>'s validation flow, and is disabled
 * until the current step's required fields are valid.
 */
export function StepNav({
  isFirst,
  isLast,
  isSubmitting,
  canProceed,
  onBack,
}: StepNavProps) {
  const { t } = useTranslation();

  return (
    // On mobile this becomes a fixed bottom bar; on sm+ it stays inline.
    <div className="mt-8 max-sm:fixed max-sm:inset-x-0 max-sm:bottom-0 max-sm:z-10 max-sm:mt-0 max-sm:border-t max-sm:border-slate-200 max-sm:bg-white max-sm:shadow-[0_-1px_4px_rgba(0,0,0,0.06)]">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 max-sm:px-4 max-sm:py-3">
        <button
          type="button"
          onClick={onBack}
          disabled={isFirst}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:invisible cursor-pointer max-sm:flex-1 max-sm:disabled:hidden"
        >
          {t('nav.back')}
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !canProceed}
          className="rounded-md bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer max-sm:flex-1"
        >
          {isLast
            ? isSubmitting
              ? t('nav.submitting')
              : t('nav.submit')
            : t('nav.next')}
        </button>
      </div>
    </div>
  );
}
