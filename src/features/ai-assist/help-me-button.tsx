/**
 * HelpMeWriteButton
 *
 * AI "Help me write" trigger shown beside each Step 3 textarea.
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { isAiConfigured } from '@/utils/env';
import { useHelpWrite } from '@/features/ai-assist/hooks/use-help-write';
import { buildPrompt } from '@/features/ai-assist/build-prompt';
import { SuggestionDialog } from '@/features/ai-assist/components/suggestion-dialog';

interface HelpMeWriteButtonProps {
  fieldLabel: string;
  value: string;
  onAccept: (text: string) => void;
}

export function HelpMeWriteButton({
  fieldLabel,
  value,
  onAccept,
}: HelpMeWriteButtonProps) {
  const { t, i18n } = useTranslation();
  const { status, suggestion, errorKey, isLoading, generate, reset } = useHelpWrite();
  const [open, setOpen] = useState(false);
  const configured = isAiConfigured();

  const promptFor = () => buildPrompt(fieldLabel, value, i18n.language);

  const start = () => {
    setOpen(true);
    void generate(promptFor());
  };

  const close = () => {
    setOpen(false);
    reset();
  };

  const accept = (text: string) => {
    onAccept(text);
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
