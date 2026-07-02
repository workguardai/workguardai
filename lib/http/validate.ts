/**
 * Request validation helpers.
 *
 * Responsibility: Parse and validate incoming request data (JSON body, query
 * string, route params) against a Zod schema, throwing `ValidationError` on
 * failure so the pipeline maps it to a 400. Never trust client data.
 */
import { z } from 'zod';
import type { NextRequest } from 'next/server';

import { ValidationError } from '@/lib/errors';

/** Parse and validate a JSON request body. */
export async function parseJsonBody<TSchema extends z.ZodTypeAny>(
  req: NextRequest,
  schema: TSchema,
): Promise<z.infer<TSchema>> {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    throw new ValidationError('Request body must be valid JSON');
  }
  return schema.parse(raw);
}

/** Validate the URL query string. */
export function parseQuery<TSchema extends z.ZodTypeAny>(
  req: NextRequest,
  schema: TSchema,
): z.infer<TSchema> {
  const params = Object.fromEntries(req.nextUrl.searchParams.entries());
  return schema.parse(params);
}

/** Validate resolved route params (already awaited). */
export function parseParams<TSchema extends z.ZodTypeAny>(
  params: unknown,
  schema: TSchema,
): z.infer<TSchema> {
  return schema.parse(params);
}
