import { describe, it, expect } from 'vitest';

import { isNetworkError, ServiceUnavailableError, UnauthorizedError } from '@/lib/errors';

describe('isNetworkError', () => {
  it('detects a DNS failure by code', () => {
    expect(isNetworkError({ code: 'ENOTFOUND' })).toBe(true);
  });

  it('detects a "fetch failed" message', () => {
    expect(isNetworkError(new TypeError('fetch failed'))).toBe(true);
  });

  it('detects a nested cause', () => {
    expect(isNetworkError({ message: 'fetch failed', cause: { code: 'ECONNREFUSED' } })).toBe(true);
  });

  it('does not flag a normal auth rejection', () => {
    expect(isNetworkError(new UnauthorizedError('Invalid email or password'))).toBe(false);
  });

  it('does not flag arbitrary objects', () => {
    expect(isNetworkError({ foo: 'bar' })).toBe(false);
    expect(isNetworkError(null)).toBe(false);
  });
});

describe('ServiceUnavailableError', () => {
  it('carries a 503 status and stable code', () => {
    const err = new ServiceUnavailableError();
    expect(err.status).toBe(503);
    expect(err.code).toBe('SERVICE_UNAVAILABLE');
  });
});
