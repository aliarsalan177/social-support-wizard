import type { ReactElement, ReactNode } from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { WizardProvider } from '@/features/wizard';

/** Renders UI inside the router + wizard form context used across the app. */
export function renderWithProviders(
  ui: ReactElement,
  { route = '/apply/step/1' }: { route?: string } = {},
) {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={[route]}>
      <WizardProvider>{children}</WizardProvider>
    </MemoryRouter>
  );
  return render(ui, { wrapper: Wrapper });
}
