import ky from 'ky';

/**
 * Shared HTTP client. `ky` gives us, out of the box, what we'd otherwise
 * hand-roll around `fetch`:
 *  - a request timeout (AbortController under the hood)
 *  - automatic retry with backoff on transient failures
 *  - throwing on non-2xx responses (no manual `res.ok` checks)
 *
 * Per-call options (e.g. `retry: 0`) can override these defaults.
 */
export const http = ky.create({
  timeout: 20_000,
  retry: {
    limit: 2,
    methods: ['get', 'post'],
    statusCodes: [408, 429, 500, 502, 503, 504],
    backoffLimit: 1_000,
  },
});

// Re-export ky's typed errors so callers can branch on them.
export { HTTPError, TimeoutError } from 'ky';
