/**
 * Centralised, validated access to environment variables.
 * Keeping this in one place means the rest of the app never reads
 * `import.meta.env` directly.
 */
import { getStoredOpenAiKey } from '@/utils/openai-key';

/** Build-time key from Vite env (optional). */
const BUILD_OPENAI_KEY = (import.meta.env.VITE_OPENAI_API_KEY ?? '').trim();

export const env = {
  OPENAI_MODEL: import.meta.env.VITE_OPENAI_MODEL ?? 'gpt-3.5-turbo',
  /** Mock endpoint by default; tests intercept this with MSW. */
  SUBMIT_URL: import.meta.env.VITE_SUBMIT_URL ?? '/api/applications',
} as const;

/**
 * Resolve the OpenAI key at call time: a build-time `VITE_OPENAI_API_KEY` wins;
 * otherwise a key supplied via `?open-ai-key=` in the URL (stored with a 10-min
 * TTL) is used. Returns '' when neither is available.
 */
export function getOpenAiKey(): string {
  return BUILD_OPENAI_KEY || getStoredOpenAiKey();
}

/** True when an OpenAI key is available. UI uses this to disable AI cleanly. */
export const isAiConfigured = (): boolean => getOpenAiKey().length > 0;
