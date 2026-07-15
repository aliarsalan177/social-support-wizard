import { useTranslation } from 'react-i18next';

export function SuccessScreen({ referenceNumber }: { referenceNumber: string }) {
  const { t } = useTranslation();
  return (
    <div
      role="status"
      className="rounded-lg border border-green-200 bg-green-50 p-8 text-center"
    >
      <div
        aria-hidden="true"
        className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-2xl text-white"
      >
        ✓
      </div>
      <h2 className="text-xl font-semibold text-slate-900">
        {t('submit.successTitle')}
      </h2>
      <p className="mt-2 text-slate-600">
        {t('submit.successBody', { ref: referenceNumber })}
      </p>
    </div>
  );
}
