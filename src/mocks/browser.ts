import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

/** Service-worker-based mocking used during `pnpm dev`. */
export const worker = setupWorker(...handlers);
