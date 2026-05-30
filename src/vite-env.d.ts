/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** OpenAI API key — used only by the "Help Me Write" feature. */
  readonly VITE_OPENAI_API_KEY?: string;
  /** OpenAI model id (defaults to gpt-3.5-turbo). */
  readonly VITE_OPENAI_MODEL?: string;
  /** Endpoint the final application is POSTed to (mock by default). */
  readonly VITE_SUBMIT_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
