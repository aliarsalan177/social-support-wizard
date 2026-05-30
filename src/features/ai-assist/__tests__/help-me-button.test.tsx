import { describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from '@/mocks/server';
import { renderWithProviders } from '@/test/utils';
import { Step3Situation } from '@/features/wizard/steps/step-3-situation';

// Pretend an API key is configured so the AI button is enabled.
vi.mock('@/utils/env', () => ({
  env: {
    OPENAI_API_KEY: 'test-key',
    OPENAI_MODEL: 'gpt-3.5-turbo',
    SUBMIT_URL: '/api/applications',
  },
  isAiConfigured: () => true,
}));

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

describe('HelpMeWriteButton', () => {
  it('shows a suggestion and accepts it into the field', async () => {
    server.use(
      http.post(OPENAI_URL, () =>
        HttpResponse.json({
          choices: [{ message: { content: 'I am currently facing financial hardship.' } }],
        }),
      ),
    );
    const user = userEvent.setup();
    renderWithProviders(<Step3Situation />);

    await user.click(screen.getAllByRole('button', { name: /help me write/i })[0]);

    const dialog = await screen.findByRole('dialog');
    await waitFor(() =>
      expect(dialog).toHaveTextContent('I am currently facing financial hardship.'),
    );

    await user.click(screen.getByRole('button', { name: 'Accept' }));

    expect(screen.getByLabelText('Current Financial Situation')).toHaveValue(
      'I am currently facing financial hardship.',
    );
  });

  it('shows an error with a retry when the API fails', async () => {
    server.use(http.post(OPENAI_URL, () => new HttpResponse(null, { status: 500 })));
    const user = userEvent.setup();
    renderWithProviders(<Step3Situation />);

    await user.click(screen.getAllByRole('button', { name: /help me write/i })[0]);

    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });

  it('discards the suggestion without changing the field', async () => {
    server.use(
      http.post(OPENAI_URL, () =>
        HttpResponse.json({ choices: [{ message: { content: 'A discarded suggestion.' } }] }),
      ),
    );
    const user = userEvent.setup();
    renderWithProviders(<Step3Situation />);

    await user.click(screen.getAllByRole('button', { name: /help me write/i })[0]);
    await screen.findByRole('dialog');
    await user.click(screen.getByRole('button', { name: 'Discard' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Current Financial Situation')).toHaveValue('');
  });
});
