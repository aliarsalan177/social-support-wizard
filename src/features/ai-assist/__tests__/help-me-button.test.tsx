import { describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from '@/mocks/server';
import { renderWithProviders } from '@/test/utils';
import { AiTextareaControl } from '@/features/wizard/components/ai-textarea-control';

vi.mock('@/utils/env', () => ({
  env: { OPENAI_MODEL: 'gpt-3.5-turbo', SUBMIT_URL: '/api/applications' },
  getOpenAiKey: () => 'test-key',
  isAiConfigured: () => true,
}));

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

function renderField(value = '', onChange = vi.fn()) {
  return renderWithProviders(
    <AiTextareaControl
      id="currentFinancialSituation"
      fieldId="currentFinancialSituation"
      label="Current Financial Situation"
      value={value}
      enabled
      onChange={onChange}
    />,
  );
}

describe('HelpMeWriteButton', () => {
  it('shows a suggestion and accepts it into the field', async () => {
    server.use(
      http.post(OPENAI_URL, () =>
        HttpResponse.json({
          choices: [{ message: { content: 'I am currently facing financial hardship.' } }],
        }),
      ),
    );
    const onChange = vi.fn();
    const user = userEvent.setup();
    renderField('', onChange);

    await user.click(screen.getByRole('button', { name: /help me write/i }));

    const dialog = await screen.findByRole('dialog');
    await waitFor(() =>
      expect(dialog).toHaveTextContent('I am currently facing financial hardship.'),
    );

    await user.click(screen.getByRole('button', { name: 'Accept' }));

    expect(onChange).toHaveBeenCalledWith('I am currently facing financial hardship.');
  });

  it('shows an error with a retry when the API fails', async () => {
    server.use(http.post(OPENAI_URL, () => new HttpResponse(null, { status: 500 })));
    const user = userEvent.setup();
    renderField();

    await user.click(screen.getByRole('button', { name: /help me write/i }));

    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });

  it('discards the suggestion without changing the field', async () => {
    server.use(
      http.post(OPENAI_URL, () =>
        HttpResponse.json({ choices: [{ message: { content: 'A discarded suggestion.' } }] }),
      ),
    );
    const onChange = vi.fn();
    const user = userEvent.setup();
    renderField('', onChange);

    await user.click(screen.getByRole('button', { name: /help me write/i }));
    await screen.findByRole('dialog');
    await user.click(screen.getByRole('button', { name: 'Discard' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });
});
