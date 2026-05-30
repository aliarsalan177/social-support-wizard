/**
 * HelpMeWriteButton
 *
 * AI "Help me write" trigger shown beside each Step 3 textarea. On click it:
 * - builds a prompt from the field label + any text already entered
 * - requests a suggestion from the OpenAI API
 * - opens a dialog to Accept / Edit / Discard the result
 *
 * Disabled (with an explanatory tooltip) when no OpenAI key is configured.
 *
 * Used in:
 * - Step3Situation
 *
 * Depends on:
 * - useHelpWrite (OpenAI request lifecycle + cancellation)
 * - SuggestionDialog
 * - React Hook Form (form context)
 */
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { ApplicationData } from '@/features/wizard/schema';
import { isAiConfigured } from '@/utils/env';
import { useHelpWrite } from './hooks/use-help-write';
import { buildPrompt } from './build-prompt';
import { SuggestionDialog } from './components/suggestion-dialog';

type AiField = Extract<
  keyof ApplicationData,
  'currentFinancialSituation' | 'employmentCircumstances' | 'reasonForApplying'
>;

interface HelpMeWriteButtonProps {
  field: AiField;
  fieldLabel: string;
}

export function HelpMeWriteButton({ field, fieldLabel }: HelpMeWriteButtonProps) {
  const { t, i18n } = useTranslation();
  const { getValues, setValue } = useFormContext<ApplicationData>();
  const { status, suggestion, errorKey, isLoading, generate, reset } = useHelpWrite();
  const [open, setOpen] = useState(false);
  const configured = isAiConfigured();

  const promptFor = () => buildPrompt(fieldLabel, getValues(field) ?? '', i18n.language);

  const start = () => {
    setOpen(true);
    void generate(promptFor());
  };

  const close = () => {
    setOpen(false);
    reset();
  };

  const accept = (text: string) => {
    setValue(field, text, { shouldValidate: true, shouldDirty: true });
    close();
  };

  const handleRetry = () => void generate(promptFor());

  return (
    <>
      <button
        type="button"
        onClick={start}
        disabled={!configured}
        title={configured ? undefined : t('ai.unavailable')}
        className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-brand-200 bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700 hover:bg-brand-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span aria-hidden="true">✨</span>
        {t('ai.helpMeWrite')}
      </button>

      <SuggestionDialog
        open={open}
        isLoading={isLoading}
        suggestion={status === 'success' ? suggestion : ''}
        errorKey={errorKey}
        onAccept={accept}
        onDiscard={close}
        onRetry={handleRetry}
      />
    </>
  );
}
