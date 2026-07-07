import { describe, it, expect } from 'vitest';

import { apiErrorMessage } from '@/lib/apiError';

describe('apiErrorMessage', () => {
  it('extracts the message from an error envelope', () => {
    const err = { status: 401, data: { ok: false, error: { code: 'UNAUTHORIZED', message: 'Invalid email or password' } } };
    expect(apiErrorMessage(err)).toBe('Invalid email or password');
  });

  it('falls back when there is no envelope', () => {
    expect(apiErrorMessage(undefined)).toBe('Something went wrong.');
    expect(apiErrorMessage({ status: 500 }, 'Custom fallback')).toBe('Custom fallback');
  });
});
