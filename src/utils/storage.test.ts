import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { debounce, readJson, remove, writeJson } from './storage';

describe('storage helpers', () => {
  beforeEach(() => localStorage.clear());

  it('round-trips JSON values', () => {
    writeJson('k', { a: 1 });
    expect(readJson<{ a: number }>('k')).toEqual({ a: 1 });
  });

  it('returns null for missing or corrupt values', () => {
    expect(readJson('missing')).toBeNull();
    localStorage.setItem('bad', '{not json');
    expect(readJson('bad')).toBeNull();
  });

  it('removes a key', () => {
    writeJson('k', 1);
    remove('k');
    expect(readJson('k')).toBeNull();
  });
});

describe('debounce', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('only fires once after the last call', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 200);
    debounced('a');
    debounced('b');
    debounced('c');
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(200);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('c');
  });
});
