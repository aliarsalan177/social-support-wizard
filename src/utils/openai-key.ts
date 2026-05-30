import { readJson, remove, writeJson } from '@/utils/storage';

const STORAGE_KEY = 'social-support-wizard:openai-key';
const TTL_MS = 10 * 60 * 1000; // 10 minutes
const URL_PARAM = 'open-ai-key';

interface StoredKey {
  value: string;
  expiresAt: number;
}

/**
 * If the URL carries `?open-ai-key=...`, store the key for 10 minutes and strip
 * it from the address bar (so it isn't bookmarked or left in history). Lets
 * anyone try the deployed demo with their own key without a rebuild.
 */
export function captureOpenAiKeyFromUrl(): void {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  const key = url.searchParams.get(URL_PARAM)?.trim();
  if (!key) return;

  writeJson(STORAGE_KEY, { value: key, expiresAt: Date.now() + TTL_MS } satisfies StoredKey);
  url.searchParams.delete(URL_PARAM);
  window.history.replaceState(window.history.state, '', url.toString());
}

/**
 * The stored key if present and within its 10-minute TTL, otherwise ''.
 * Expired keys are removed on read.
 */
export function getStoredOpenAiKey(): string {
  const stored = readJson<StoredKey>(STORAGE_KEY);
  if (!stored) return '';
  if (Date.now() >= stored.expiresAt) {
    remove(STORAGE_KEY);
    return '';
  }
  return stored.value;
}
