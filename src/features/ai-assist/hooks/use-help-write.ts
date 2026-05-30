import { useCallback, useRef, useState } from 'react';
import { AiError, generateSuggestion } from '@/features/ai-assist/openai';

type Status = 'idle' | 'loading' | 'success' | 'error';

/**
 * Owns one "Help me write" request lifecycle: loading state, the resulting
 * suggestion, a localized error key, and cancellation via AbortController.
 */
export function useHelpWrite() {
  const [status, setStatus] = useState<Status>('idle');
  const [suggestion, setSuggestion] = useState('');
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const generate = useCallback(async (prompt: string) => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setStatus('loading');
    setErrorKey(null);
    try {
      const text = await generateSuggestion(prompt, controller.signal);
      setSuggestion(text);
      setStatus('success');
    } catch (err) {
      const kind = err instanceof AiError ? err.kind : 'generic';
      setErrorKey(`ai.errors.${kind}`);
      setStatus('error');
    }
  }, []);

  const reset = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    setStatus('idle');
    setSuggestion('');
    setErrorKey(null);
  }, []);

  return {
    status,
    suggestion,
    errorKey,
    isLoading: status === 'loading',
    generate,
    reset,
  };
}
