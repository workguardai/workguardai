/**
 * Validated HTTP responses and centralized error mapping.
 *
 * Responsibility: Build the JSON response envelope (validating success payloads
 * against a Zod schema) and translate any thrown error into a safe error
 * envelope with the correct status code. Stack traces are never exposed.
 *
 * Inputs:  a Zod schema + payload (success) or an unknown error (failure).
 * Outputs: a `Response` carrying the validated envelope.
 */
import { z } from 'zod';
import { Prisma } from '@prisma/client';

import { AppError, ErrorCode, isAppError, isNetworkError } from '@/lib/errors';
import { ContentType, HttpHeader } from '@/lib/constants';
import { successEnvelope } from '@/schemas/common';
import type { Logger } from '@/lib/logger';

function baseHeaders(correlationId: string): HeadersInit {
  return {
    [HttpHeader.CONTENT_TYPE]: ContentType.JSON,
    [HttpHeader.CORRELATION_ID]: correlationId,
  };
}

/**
 * Serialize a success payload. `dataSchema` describes ONLY the `data` field; the
 * envelope is built and validated here. If `data` does not match the declared
 * response contract this throws, surfacing the bug rather than shipping an
 * invalid body (CLAUDE.md: no endpoint returns an unvalidated object).
 */
export function jsonOk<TSchema extends z.ZodTypeAny>(
  dataSchema: TSchema,
  data: z.input<TSchema>,
  init: {
    correlationId: string;
    status?: number;
    meta?: Record<string, unknown>;
  },
): Response {
  const validated = successEnvelope(dataSchema).parse({
    ok: true,
    data,
    meta: { correlationId: init.correlationId, ...init.meta },
  });

  return new Response(JSON.stringify(validated), {
    status: init.status ?? 200,
    headers: baseHeaders(init.correlationId),
  });
}

interface MappedError {
  status: number;
  code: ErrorCode;
  message: string;
  details?: unknown;
}

/** Map any thrown value to a safe, typed error shape. */
function mapError(error: unknown): MappedError {
  if (error instanceof z.ZodError) {
    return {
      status: 400,
      code: ErrorCode.VALIDATION_ERROR,
      message: 'Request validation failed',
      details: error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
    };
  }

  if (isAppError(error)) {
    return {
      status: error.status,
      code: error.code,
      message: error.message,
      details: error.details,
    };
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return { status: 409, code: ErrorCode.CONFLICT, message: 'Resource already exists' };
    }
    if (error.code === 'P2025') {
      return { status: 404, code: ErrorCode.NOT_FOUND, message: 'Resource not found' };
    }
  }

  if (isNetworkError(error)) {
    return {
      status: 503,
      code: ErrorCode.SERVICE_UNAVAILABLE,
      message: 'Service temporarily unavailable. Please try again shortly.',
    };
  }

  return {
    status: 500,
    code: ErrorCode.INTERNAL_ERROR,
    message: 'An unexpected error occurred',
  };
}

/**
 * Convert an error into a JSON error envelope. Logs full detail server-side;
 * returns only client-safe fields.
 */
export function jsonError(error: unknown, correlationId: string, log: Logger): Response {
  const mapped = mapError(error);

  const logPayload = {
    code: mapped.code,
    status: mapped.status,
    err: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
  };

  if (mapped.status >= 500) {
    log.error('request.failed', logPayload);
  } else {
    log.warn('request.rejected', logPayload);
  }

  const body: {
    ok: false;
    error: { code: ErrorCode; message: string; details?: unknown };
    meta: { correlationId: string };
  } = {
    ok: false,
    error: { code: mapped.code, message: mapped.message },
    meta: { correlationId },
  };

  if (mapped.details !== undefined && mapped.status < 500) {
    body.error.details = mapped.details;
  }

  return new Response(JSON.stringify(body), {
    status: mapped.status,
    headers: baseHeaders(correlationId),
  });
}

/** Re-exported so a not-thrown AppError can still be turned into a response. */
export { AppError };
