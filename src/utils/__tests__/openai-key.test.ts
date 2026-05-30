import { afterEach, describe, expect, it } from 'vitest';
import { captureOpenAiKeyFromUrl, getStoredOpenAiKey } from '@/utils/openai-key';

const STORAGE_KEY = 'social-support-wizard:openai-key';

afterEach(() => {
  localStorage.clear();
  window.history.replaceState({}, '', '/');
});

describe('OpenAI key from URL', () => {
  it('captures ?open-ai-key, persists it, and strips it from the URL', () => {
    window.history.replaceState({}, '', '/apply/step/1?open-ai-key=sk-test-123');
    captureOpenAiKeyFromUrl();

    expect(getStoredOpenAiKey()).toBe('sk-test-123');
    expect(window.location.search).not.toContain('open-ai-key');
  });

  it('returns "" and clears an expired key', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ value: 'sk-old', expiresAt: Date.now() - 1 }),
    );
    expect(getStoredOpenAiKey()).toBe('');
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('returns "" when no key has been provided', () => {
    expect(getStoredOpenAiKey()).toBe('');
  });
});
