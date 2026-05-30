/**
 * SuggestionDialog
 *
 * Modal that presents an AI-generated suggestion with:
 * - loading and error (with retry) states
 * - Accept / Edit / Discard actions
 * - inline editing of the suggestion before accepting
 *
 * Used in:
 * - HelpMeWriteButton
 *
 * Depends on:
 * - Dialog (accessible modal primitive)
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog } from '@/components/dialog';

interface SuggestionDialogProps {
  open: boolean;
  isLoading: boolean;
  suggestion: string;
  errorKey: string | null;
  onAccept: (text: string) => void;
  onDiscard: () => void;
  onRetry: () => void;
}

export function SuggestionDialog({
  open,
  isLoading,
  suggestion,
  errorKey,
  onAccept,
  onDiscard,
  onRetry,
}: SuggestionDialogProps) {
  const { t } = useTranslation();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(suggestion);

  // Reset the editable draft when a new suggestion arrives, using React's
  // "adjust state during render" pattern instead of an effect.
  const [lastSuggestion, setLastSuggestion] = useState(suggestion);
  if (suggestion !== lastSuggestion) {
    setLastSuggestion(suggestion);
    setDraft(suggestion);
    setEditing(false);
  }

  return (
    <Dialog open={open} title={t('ai.dialogTitle')} onClose={onDiscard}>
      {isLoading && (
        <p role="status" className="text-slate-600">
          {t('ai.generating')}
        </p>
      )}

      {!isLoading && errorKey && (
        <div>
          <p role="alert" className="text-red-600">
            {t(errorKey as never)}
          </p>
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onDiscard}
              className="cursor-pointer rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              {t('ai.discard')}
            </button>
            <button
              type="button"
              onClick={onRetry}
              className="cursor-pointer rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            >
              {t('ai.retry')}
            </button>
          </div>
        </div>
      )}

      {!isLoading && !errorKey && (
        <div>
          {editing ? (
            <>
              <p className="mb-2 text-sm text-slate-500">{t('ai.editHint')}</p>
              <textarea
                aria-label={t('ai.dialogTitle')}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={6}
                className="block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900"
              />
            </>
          ) : (
            <p className="whitespace-pre-wrap rounded-md bg-slate-50 p-3 text-slate-800">
              {draft}
            </p>
          )}

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onDiscard}
              className="cursor-pointer rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              {t('ai.discard')}
            </button>
            {!editing && (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="cursor-pointer rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                {t('ai.edit')}
              </button>
            )}
            <button
              type="button"
              onClick={() => onAccept(draft)}
              className="cursor-pointer rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            >
              {t('ai.accept')}
            </button>
          </div>
        </div>
      )}
    </Dialog>
  );
}
