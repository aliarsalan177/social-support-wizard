import { useTranslation } from 'react-i18next';
import { TOTAL_STEPS } from '@/features/wizard/schema';
import { STEP_MAP, type StepNumber } from '@/features/wizard/steps/step-config';

export function ProgressBar({ current }: { current: number }) {
  const { t } = useTranslation();
  const pct = Math.round((current / TOTAL_STEPS) * 100);
  const titleKey = STEP_MAP[current as StepNumber].titleKey;

  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-medium text-slate-700">{t(titleKey)}</p>
        <p className="text-sm text-slate-500">
          {t('progress.step', { current, total: TOTAL_STEPS })}
        </p>
      </div>
      <div
        role="progressbar"
        aria-label={t('progress.label')}
        aria-valuenow={current}
        aria-valuemin={1}
        aria-valuemax={TOTAL_STEPS}
        className="h-2 w-full overflow-hidden rounded-full bg-slate-200"
      >
        <div
          className="h-full rounded-full bg-brand-600 transition-all duration-300"
          style={{ inlineSize: `${pct}%` }}
        />
      </div>
    </div>
  );
}
