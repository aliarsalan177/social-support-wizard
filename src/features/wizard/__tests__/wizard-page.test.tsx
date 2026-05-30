import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from '@/App';
import { DRAFT_STORAGE_KEY } from '@/features/wizard/defaults';

function renderApp(route = '/apply/step/1') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>,
  );
}

async function fillStep1(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Full name'), 'Sara Ahmed');
  await user.type(screen.getByLabelText('National ID'), '1234567890');
  fireEvent.change(screen.getByLabelText('Date of birth'), {
    target: { value: '1990-01-01' },
  });
  await user.selectOptions(screen.getByLabelText('Gender'), 'female');
  await user.type(screen.getByLabelText('Address'), '12 Main St');
  await user.type(screen.getByLabelText('City'), 'Riyadh');
  await user.type(screen.getByLabelText('State'), 'Riyadh');
  await user.type(screen.getByLabelText('Country'), 'Saudi Arabia');
  await user.type(screen.getByLabelText('Phone'), '+966500000000');
  await user.type(screen.getByLabelText('Email'), 'sara@example.com');
}

async function fillStep2(user: ReturnType<typeof userEvent.setup>) {
  await user.selectOptions(screen.getByLabelText('Marital status'), 'single');
  await user.type(screen.getByLabelText('Number of dependents'), '0');
  await user.selectOptions(screen.getByLabelText('Employment status'), 'unemployed');
  await user.type(screen.getByLabelText('Monthly income'), '0');
  await user.selectOptions(screen.getByLabelText('Housing status'), 'rented');
}

async function fillStep3(user: ReturnType<typeof userEvent.setup>) {
  await user.type(
    screen.getByLabelText('Current financial situation'),
    'I am currently unemployed with no income.',
  );
  await user.type(
    screen.getByLabelText('Employment circumstances'),
    'I lost my job six months ago and cannot find work.',
  );
  await user.type(
    screen.getByLabelText('Reason for applying'),
    'I need help covering rent and basic living costs.',
  );
}

describe('Wizard navigation', () => {
  it('blocks advancing when the current step is invalid', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole('button', { name: 'Next' }));

    expect(await screen.findAllByText('This field is required')).not.toHaveLength(0);
    expect(screen.getByText('Step 1 of 3')).toBeInTheDocument();
  });

  it('validates a field live as the user types, without flagging untouched fields', async () => {
    const user = userEvent.setup();
    renderApp();

    // Typing an invalid email shows that field's error in real time...
    await user.type(screen.getByLabelText('Email'), 'not-an-email');
    expect(
      await screen.findByText('Enter a valid email address'),
    ).toBeInTheDocument();

    // ...but other still-untouched fields are NOT flagged yet.
    expect(screen.queryByText('This field is required')).not.toBeInTheDocument();

    // Correcting the value clears the error live.
    await user.clear(screen.getByLabelText('Email'));
    await user.type(screen.getByLabelText('Email'), 'sara@example.com');
    await waitFor(() =>
      expect(
        screen.queryByText('Enter a valid email address'),
      ).not.toBeInTheDocument(),
    );
  });

  it('advances to step 2 once step 1 is valid', async () => {
    const user = userEvent.setup();
    renderApp();

    await fillStep1(user);
    await user.click(screen.getByRole('button', { name: 'Next' }));

    expect(await screen.findByText('Step 2 of 3')).toBeInTheDocument();
  });

  it('completes all steps and submits successfully', async () => {
    const user = userEvent.setup();
    renderApp();

    await fillStep1(user);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    await screen.findByText('Step 2 of 3');

    await fillStep2(user);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    await screen.findByText('Step 3 of 3');

    await fillStep3(user);
    await user.click(screen.getByRole('button', { name: 'Submit application' }));

    await waitFor(() =>
      expect(screen.getByText('Application submitted')).toBeInTheDocument(),
    );
    // Reference number comes from the MSW mock backend.
    expect(screen.getByText(/SSW-/)).toBeInTheDocument();

    // Storage is cleared after a successful submission.
    expect(localStorage.getItem(DRAFT_STORAGE_KEY)).toBeNull();
  });
});

describe('Draft persistence & resume', () => {
  const SAVED_DRAFT = {
    name: 'Returning User',
    nationalId: '5555555555',
    email: 'returning@example.com',
  };

  function seedDraft() {
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(SAVED_DRAFT));
  }

  it('starts empty and only autofills the form after clicking Resume', async () => {
    seedDraft();
    const user = userEvent.setup();
    renderApp();

    // Form starts empty even though a draft exists.
    expect(screen.getByLabelText('Full name')).toHaveValue('');

    await user.click(screen.getByRole('button', { name: 'Resume' }));

    // Now the saved values are loaded.
    expect(screen.getByLabelText('Full name')).toHaveValue('Returning User');
    expect(screen.getByLabelText('Email')).toHaveValue('returning@example.com');
  });

  it('overwrites a stale draft with new data when the user does not resume', async () => {
    seedDraft();
    const user = userEvent.setup();
    renderApp();

    // Ignore the banner and type fresh data instead.
    await user.type(screen.getByLabelText('Full name'), 'Fresh Start');

    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem(DRAFT_STORAGE_KEY) ?? '{}');
      expect(stored.name).toBe('Fresh Start');
    });
  });

  it('shows no resume banner when there is no saved draft', () => {
    renderApp();
    expect(screen.queryByRole('button', { name: 'Resume' })).not.toBeInTheDocument();
  });
});

describe('Step access guard', () => {
  it('redirects to step 1 when deep-linking to step 3 with nothing filled', async () => {
    renderApp('/apply/step/3');
    expect(await screen.findByText('Step 1 of 3')).toBeInTheDocument();
  });

  it('redirects to step 1 when deep-linking to step 2 with nothing filled', async () => {
    renderApp('/apply/step/2');
    expect(await screen.findByText('Step 1 of 3')).toBeInTheDocument();
  });

  it('allows step 2 once step 1 is valid, but still blocks step 3', async () => {
    const user = userEvent.setup();
    renderApp();

    await fillStep1(user);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(await screen.findByText('Step 2 of 3')).toBeInTheDocument();

    // Step 2 is reachable, but step 3 is not until step 2 is completed.
    expect(screen.queryByText('Step 3 of 3')).not.toBeInTheDocument();
  });
});
