import { setupWorker } from 'msw/browser';
import { handlers } from '@/mocks/handlers';

/** Service-worker-based mocking used during `pnpm dev`. */
export const worker = setupWorker(...handlers);
