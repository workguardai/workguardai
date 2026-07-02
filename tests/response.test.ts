/**
 * Tests for the response envelope + centralized error mapping. Ensures success
 * payloads are validated/enveloped and errors map to safe, typed envelopes with
 * correct status codes and no stack traces.
 */
import { describe, it, expect, vi } from 'vitest';
import { z } from 'zod';

import { jsonOk, jsonError } from '@/lib/http/response';
import { ForbiddenError, NotFoundError } from '@/lib/errors';
import { createLogger } from '@/lib/logger';

vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
vi.spyOn(process.stderr, 'write').mockImplementation(() => true);
const log = createLogger();

describe('jsonOk', () => {
  it('wraps and validates a success payload', async () => {
    const res = jsonOk(z.object({ a: z.string() }), { a: 'x' }, { correlationId: 'cid' });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toMatchObject({ ok: true, data: { a: 'x' }, meta: { correlationId: 'cid' } });
  });

  it('throws when the payload violates the response contract', () => {
    expect(() =>
      // @ts-expect-error intentional contract violation
      jsonOk(z.object({ a: z.string() }), { a: 123 }, { correlationId: 'cid' }),
    ).toThrow();
  });
});

describe('jsonError', () => {
  it('maps an AppError to its status and code', async () => {
    const res = jsonError(new ForbiddenError(), 'cid', log);
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error.code).toBe('FORBIDDEN');
    expect(body.error.stack).toBeUndefined();
  });

  it('maps a ZodError to a 400 validation error', async () => {
    const zodErr = z.object({ a: z.string() }).safeParse({ a: 1 });
    const res = jsonError(zodErr.success ? new Error() : zodErr.error, 'cid', log);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error.code).toBe('VALIDATION_ERROR');
  });

  it('maps an unknown error to a 500 without leaking detail', async () => {
    const res = jsonError(new Error('secret internals'), 'cid', log);
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error.message).not.toContain('secret internals');
    expect(body.error.code).toBe('INTERNAL_ERROR');
  });

  it('maps NotFoundError to 404', async () => {
    const res = jsonError(new NotFoundError(), 'cid', log);
    expect(res.status).toBe(404);
  });
});
