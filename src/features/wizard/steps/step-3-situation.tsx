import { useTranslation } from 'react-i18next';
import { TextAreaField } from '@/components/form/text-area-field';
import { HelpMeWriteButton } from '@/features/ai-assist';

const AI_FIELDS = [
  'currentFinancialSituation',
  'employmentCircumstances',
  'reasonForApplying',
] as const;

export function Step3Situation() {
  const { t } = useTranslation();
  return (
    <fieldset className="grid grid-cols-1 gap-5">
      <legend className="sr-only">{t('steps.situation')}</legend>

      {AI_FIELDS.map((field) => (
        <TextAreaField
          key={field}
          name={field}
          label={t(`fields.${field}` as const)}
          rows={5}
          action={<HelpMeWriteButton field={field} fieldLabel={t(`fields.${field}` as const)} />}
        />
      ))}
    </fieldset>
  );
}
