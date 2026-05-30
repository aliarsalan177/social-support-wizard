import { useTranslation } from 'react-i18next';

interface StepNavProps {
  isFirst: boolean;
  isLast: boolean;
  isSubmitting: boolean;
  onBack: () => void;
}

/**
 * Back / Next / Submit controls. The Next/Submit button is type="submit"
 * so it participates in the step <form>'s validation flow.
 */
export function StepNav({ isFirst, isLast, isSubmitting, onBack }: StepNavProps) {
  const { t } = useTranslation();

  return (
    <div className="mt-8 flex items-center justify-between gap-3">
      <button
        type="button"
        onClick={onBack}
        disabled={isFirst}
        className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:invisible cursor-pointer"
      >
        {t('nav.back')}
      </button>
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
      >
        {isLast
          ? isSubmitting
            ? t('nav.submitting')
            : t('nav.submit')
          : t('nav.next')}
      </button>
    </div >
  );
}
