import { http, HttpResponse } from 'msw';
import { env } from '@/utils/env';

let counter = 1000;

/**
 * Mock API handlers shared by the dev browser worker and the test server.
 * Only the application submit is mocked; the OpenAI call hits the real API
 * in the app (and is mocked per-test where needed).
 */
export const handlers = [
  http.post(env.SUBMIT_URL, async () => {
    counter += 1;
    return HttpResponse.json({ referenceNumber: `SSW-${counter}` }, { status: 201 });
  }),
];
