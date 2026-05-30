import { useTranslation } from 'react-i18next';

interface ResumeBannerProps {
  onResume: () => void;
  onDiscard: () => void;
}

export function ResumeBanner({ onResume, onDiscard }: ResumeBannerProps) {
  const { t } = useTranslation();
  return (
    <div
      role="region"
      aria-label={t('resume.title')}
      className="mb-6 rounded-lg border border-brand-100 bg-brand-50 p-4"
    >
      <p className="font-medium text-slate-900">{t('resume.title')}</p>
      <p className="mt-1 text-sm text-slate-600">{t('resume.body')}</p>
      <div className="mt-3 flex gap-3">
        <button
          type="button"
          onClick={onResume}
          className="rounded-md bg-brand-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-700"
        >
          {t('resume.resume')}
        </button>
        <button
          type="button"
          onClick={onDiscard}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          {t('resume.discard')}
        </button>
      </div>
    </div>
  );
}
