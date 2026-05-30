import { setupServer } from 'msw/node';
import { handlers } from './handlers';

/** Node request interception used by the Vitest test suite. */
export const server = setupServer(...handlers);
