/**
 * Centralised, validated access to environment variables.
 * Keeping this in one place means the rest of the app never reads
 * `import.meta.env` directly and we fail loudly when something is missing.
 */

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY ?? '';

export const env = {
  /** May be empty in dev — the AI feature degrades gracefully when it is. */
  OPENAI_API_KEY,
  OPENAI_MODEL: import.meta.env.VITE_OPENAI_MODEL ?? 'gpt-3.5-turbo',
  /** Mock endpoint by default; tests intercept this with MSW. */
  SUBMIT_URL: import.meta.env.VITE_SUBMIT_URL ?? '/api/applications',
} as const;

/** True when an OpenAI key is configured. UI uses this to disable AI cleanly. */
export const isAiConfigured = (): boolean => env.OPENAI_API_KEY.trim().length > 0;
