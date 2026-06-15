import { describe, expect, it } from 'vitest';
import { Form } from '@formwright/core';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import App from '@/App';
import { PERSIST_KEY, applicationSchema } from '@/features/wizard/schema';
import { server } from '@/mocks/server';
import { env } from '@/utils/env';

function renderApp() {
  return render(
    <MemoryRouter initialEntries={['/apply']}>
      <App />
    </MemoryRouter>,
  );
}

async function fillStep1(user: ReturnType<typeof userEvent.setup>) {
  await user.type(await screen.findByRole('textbox', { name: /name/i }), 'Sara Ahmed');
  await user.type(await screen.findByRole('textbox', { name: /national id/i }), '1234567890');
  fireEvent.input(await screen.findByLabelText(/date of birth/i), {
    target: { value: '1990-01-01' },
  });
  await user.selectOptions(await screen.findByRole('combobox', { name: /gender/i }), 'female');
  await user.type(await screen.findByRole('textbox', { name: /^address/i }), '12 Main St');
  await user.type(await screen.findByRole('textbox', { name: /^city/i }), 'Riyadh');
  await user.type(await screen.findByRole('textbox', { name: /^state/i }), 'Riyadh');
  await user.type(await screen.findByRole('textbox', { name: /^country/i }), 'Saudi Arabia');
  await user.type(await screen.findByRole('textbox', { name: /phone/i }), '+966500000000');
  await user.type(await screen.findByRole('textbox', { name: /email/i }), 'sara@example.com');
}

async function fillStep2(user: ReturnType<typeof userEvent.setup>) {
  await user.selectOptions(await screen.findByRole('combobox', { name: /marital status/i }), 'single');
  await user.type(await screen.findByRole('textbox', { name: /dependents/i }), '0');
  await user.selectOptions(
    await screen.findByRole('combobox', { name: /employment status/i }),
    'unemployed',
  );
  await user.type(await screen.findByRole('textbox', { name: /monthly income/i }), '0');
  await user.selectOptions(await screen.findByRole('combobox', { name: /housing status/i }), 'rented');
}

async function fillStep3(user: ReturnType<typeof userEvent.setup>) {
  await user.type(
    await screen.findByRole('textbox', { name: /current financial situation/i }),
    'I am currently unemployed with no income.',
  );
  await user.type(
    await screen.findByRole('textbox', { name: /employment circumstances/i }),
    'I lost my job six months ago and cannot find work.',
  );
  await user.type(
    await screen.findByRole('textbox', { name: /reason for applying/i }),
    'I need help covering rent and basic living costs.',
  );
}

describe('Formwright wizard demo', () => {
  it('interpolates the submit response into schema.success', async () => {
    const host = document.createElement('div');
    const schema = applicationSchema((key) => String(key));
    const form = new Form(
      schema,
      {
        wizard: {
          personal: {
            name: 'Sara Ahmed',
            nationalId: '1234567890',
            dateOfBirth: '1990-01-01',
            gender: 'female',
            address: '12 Main St',
            city: 'Riyadh',
            state: 'Riyadh',
            country: 'Saudi Arabia',
            phone: '+966500000000',
            email: 'sara@example.com',
          },
          family: {
            maritalStatus: 'single',
            dependents: '0',
            employmentStatus: 'unemployed',
            monthlyIncome: '0',
            housingStatus: 'rented',
          },
          situation: {
            currentFinancialSituation: 'I am currently unemployed with no income.',
            employmentCircumstances: 'I lost my job six months ago and cannot find work.',
            reasonForApplying: 'I need help covering rent and basic living costs.',
          },
        },
      },
      { send: async () => ({ referenceNumber: 'SSW-TEST' }) },
    );
    form.mount(host);
    const result = await form.submit();
    expect(result.ok).toBe(true);
    expect(result.data).toEqual({ referenceNumber: 'SSW-TEST' });
    expect(form.successContext().interpolate('ID {{referenceNumber}}')).toBe('ID SSW-TEST');
    expect(host.textContent).toContain('SSW-TEST');
    form.destroy();
  });

  it('renders step 1 with Formwright progress and fields', async () => {
    renderApp();
    expect(await screen.findByRole('textbox', { name: /name/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Personal Information' })).toBeInTheDocument();
  });

  it('validates a field live as the user types', async () => {
    const user = userEvent.setup();
    renderApp();
    await screen.findByRole('textbox', { name: /email/i });
    await user.type(screen.getByRole('textbox', { name: /email/i }), 'not-an-email');
    expect(await screen.findByText('Enter a valid email address')).toBeInTheDocument();
  });

  it('advances through all steps and submits via Formwright', async () => {
    const user = userEvent.setup();
    renderApp();

    await fillStep1(user);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(
      await screen.findByRole('heading', { name: 'Family & Financial Info' }),
    ).toBeInTheDocument();

    await fillStep2(user);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(
      await screen.findByRole('heading', { name: 'Situation Descriptions' }),
    ).toBeInTheDocument();

    await fillStep3(user);
    await user.click(screen.getByRole('button', { name: 'Submit application' }));

    await waitFor(() =>
      expect(screen.getByText('Application submitted')).toBeInTheDocument(),
    );
    expect(screen.getByText(/SSW-/)).toBeInTheDocument();
    expect(localStorage.getItem(PERSIST_KEY)).toBeNull();
  });

  it('persists draft via Formwright persistKey', async () => {
    const user = userEvent.setup();
    renderApp();
    await user.type(await screen.findByRole('textbox', { name: /name/i }), 'Saved Name');
    await waitFor(() => expect(localStorage.getItem(PERSIST_KEY)).toContain('Saved Name'));
  });

  it('restores a saved draft on reload and shows the resume banner', async () => {
    const user = userEvent.setup();
    const { unmount } = renderApp();
    await user.type(await screen.findByRole('textbox', { name: /name/i }), 'Saved Name');
    await waitFor(() => expect(localStorage.getItem(PERSIST_KEY)).toContain('Saved Name'));
    unmount();

    renderApp();
    expect(await screen.findByText('We found a saved draft on this device.')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /name/i })).toHaveValue('Saved Name');
  });

  it('clears a restored draft when the user chooses Start over', async () => {
    const user = userEvent.setup();
    const { unmount } = renderApp();
    await user.type(await screen.findByRole('textbox', { name: /name/i }), 'Saved Name');
    await waitFor(() => expect(localStorage.getItem(PERSIST_KEY)).toContain('Saved Name'));
    unmount();

    renderApp();
    await user.click(await screen.findByRole('button', { name: 'Start over' }));
    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: /name/i })).toHaveValue('');
      expect(localStorage.getItem(PERSIST_KEY)).toBeNull();
    });
  });

  it('dismisses the resume banner when the user continues', async () => {
    const user = userEvent.setup();
    const { unmount } = renderApp();
    await user.type(await screen.findByRole('textbox', { name: /name/i }), 'Saved Name');
    await waitFor(() => expect(localStorage.getItem(PERSIST_KEY)).toContain('Saved Name'));
    unmount();

    renderApp();
    await screen.findByText('We found a saved draft on this device.');
    await user.click(screen.getByRole('button', { name: 'Resume' }));
    await waitFor(() => {
      const banner = document.querySelector('.fw-resume-banner') as HTMLElement | null;
      expect(banner?.hidden || banner?.style.display === 'none').toBe(true);
    });
    expect(screen.getByRole('textbox', { name: /name/i })).toHaveValue('Saved Name');
  });

  it('restores the active wizard step after reload', async () => {
    const user = userEvent.setup();
    const { unmount } = renderApp();
    await fillStep1(user);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(
      await screen.findByRole('heading', { name: 'Family & Financial Info' }),
    ).toBeInTheDocument();
    await waitFor(() => expect(localStorage.getItem(PERSIST_KEY)).toContain('family'));
    unmount();

    renderApp();
    expect(
      await screen.findByRole('heading', { name: 'Family & Financial Info' }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Back' }));
    expect(screen.getByRole('textbox', { name: /name/i })).toHaveValue('Sara Ahmed');
  });

  it('shows a submit error when the API fails', async () => {
    server.use(
      http.post(env.SUBMIT_URL, () => HttpResponse.json({ message: 'fail' }, { status: 500 })),
    );
    const user = userEvent.setup();
    renderApp();

    await fillStep1(user);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    await fillStep2(user);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    await fillStep3(user);
    await user.click(screen.getByRole('button', { name: 'Submit application' }));

    expect(
      await screen.findByText('We could not submit your application. Please try again.'),
    ).toBeInTheDocument();
    expect(localStorage.getItem(PERSIST_KEY)).toContain('reasonForApplying');
  });
});
