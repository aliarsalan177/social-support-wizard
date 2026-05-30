import { http, TimeoutError } from '@/utils/http';
import { env } from '@/utils/env';

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

/** Discriminated error so the UI can show the right localized message. */
export type AiErrorKind = 'timeout' | 'empty' | 'generic';

export class AiError extends Error {
  readonly kind: AiErrorKind;
  constructor(kind: AiErrorKind) {
    super(kind);
    this.name = 'AiError';
    this.kind = kind;
  }
}

interface ChatCompletionResponse {
  choices?: { message?: { content?: string } }[];
}

/**
 * Calls the OpenAI Chat Completions API and returns a single text suggestion.
 * ky handles the timeout and retries transient failures automatically.
 *
 * SECURITY: this talks to OpenAI directly from the browser, which exposes the
 * API key. Acceptable for this case study; in production this call MUST be
 * proxied through a backend. See README → Security.
 */
export async function generateSuggestion(
  prompt: string,
  signal?: AbortSignal,
): Promise<string> {
  let data: ChatCompletionResponse;
  try {
    data = await http
      .post(OPENAI_URL, {
        headers: { Authorization: `Bearer ${env.OPENAI_API_KEY}` },
        json: {
          model: env.OPENAI_MODEL,
          messages: [
            {
              role: 'system',
              content:
                'You help citizens describe their situation clearly, respectfully and concisely for a government social-support application. Write in the first person. Return only the suggested paragraph.',
            },
            { role: 'user', content: prompt },
          ],
          temperature: 0.7,
        },
        signal,
      })
      .json<ChatCompletionResponse>();
  } catch (err) {
    if (err instanceof TimeoutError) throw new AiError('timeout');
    throw new AiError('generic');
  }

  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new AiError('empty');
  return text;
}
