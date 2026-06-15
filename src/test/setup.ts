import '@testing-library/jest-dom/vitest';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import { server } from '@/mocks/server';
import i18n from '@/utils/i18n';
import { setupFormwright } from '@/features/wizard/formwright-setup';

setupFormwright();

// Start MSW once for the whole suite; reset handlers between tests.
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

afterEach(() => {
  server.resetHandlers();
  cleanup();
  localStorage.clear();
  // Tests assume English unless they explicitly switch.
  void i18n.changeLanguage('en');
});

afterAll(() => server.close());
