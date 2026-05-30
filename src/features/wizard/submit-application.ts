import { http } from '@/utils/http';
import { env } from '@/utils/env';
import type { ApplicationData } from '@/features/wizard/schema';

export interface SubmitResult {
  referenceNumber: string;
}

/**
 * Submit the completed application to the (mock) backend.
 * In dev a MSW worker answers this; in tests MSW's Node server does.
 *
 * `retry: 0` — never auto-retry a submit, to avoid duplicate applications.
 */
export async function submitApplication(
  data: ApplicationData,
): Promise<SubmitResult> {
  // Resolve relative endpoints against the current origin so the request
  // works in the browser, in dev (MSW), and under Node in tests (undici
  // requires an absolute URL). Absolute SUBMIT_URLs are left untouched.
  const url = new URL(env.SUBMIT_URL, globalThis.location?.origin).toString();
  return http.post(url, { json: data, retry: 0 }).json<SubmitResult>();
}
