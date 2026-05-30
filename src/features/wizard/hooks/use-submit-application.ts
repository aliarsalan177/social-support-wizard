import { useState } from 'react';
import { submitApplication, type SubmitResult } from '@/features/wizard/submit-application';
import type { ApplicationData } from '@/features/wizard/schema';

type Status = 'idle' | 'submitting' | 'success' | 'error';

/** Wraps the submit call with status flags the UI can render. */
export function useSubmitApplication() {
  const [status, setStatus] = useState<Status>('idle');
  const [result, setResult] = useState<SubmitResult | null>(null);

  const submit = async (data: ApplicationData) => {
    setStatus('submitting');
    try {
      const res = await submitApplication(data);
      setResult(res);
      setStatus('success');
      return res;
    } catch {
      setStatus('error');
      return null;
    }
  };

  return {
    submit,
    result,
    status,
    isSubmitting: status === 'submitting',
    isSuccess: status === 'success',
    isError: status === 'error',
  };
}
