/**
 * Tiny, typed, SSR-safe LocalStorage wrapper with a debounced writer.
 * Used to persist an in-progress application so users can resume it.
 */

export function readJson<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function writeJson(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota errors / private mode — persistence is best-effort.
  }
}

export function remove(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

/** Returns a debounced version of `fn` that fires `delay`ms after the last call. */
export function debounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  delay = 500,
): (...args: Args) => void {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return (...args: Args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
