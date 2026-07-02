/**
 * Route handler pipeline.
 *
 * Responsibility: Wrap Next.js Route Handlers with cross-cutting concerns:
 *  - assign/propagate a correlation ID,
 *  - build a request-scoped structured logger,
 *  - authenticate (for the authed variant),
 *  - centralize error -> response mapping so handlers never leak stack traces.
 *
 * Handlers stay thin: parse (Zod) -> service -> validate response (Zod).
 *
 * Extension point: add rate limiting or CORS here to apply it uniformly.
 */
import type { NextRequest } from 'next/server';

import { logger } from '@/lib/logger';
import { HttpHeader } from '@/lib/constants';
import { jsonError } from '@/lib/http/response';
import { requireAuthUser } from '@/lib/auth/session';
import type { AuthedRequestContext, RequestContext } from '@/types';

/** Next.js passes dynamic route params as the second argument. */
interface RouteSegment<P> {
  params: Promise<P>;
}

type PlainHandler<P> = (
  req: NextRequest,
  ctx: RequestContext,
  segment: RouteSegment<P>,
) => Promise<Response>;

type AuthedHandler<P> = (
  req: NextRequest,
  ctx: AuthedRequestContext,
  segment: RouteSegment<P>,
) => Promise<Response>;

function resolveCorrelationId(req: NextRequest): string {
  return req.headers.get(HttpHeader.CORRELATION_ID) ?? crypto.randomUUID();
}

/** Wrap a public route handler with logging and centralized error handling. */
export function withRoute<P = Record<string, never>>(handler: PlainHandler<P>) {
  return async (req: NextRequest, segment: RouteSegment<P>): Promise<Response> => {
    const correlationId = resolveCorrelationId(req);
    const log = logger.child({
      correlationId,
      method: req.method,
      path: req.nextUrl.pathname,
    });
    const ctx: RequestContext = { correlationId, logger: log };

    log.info('request.start');
    try {
      const response = await handler(req, ctx, segment);
      log.info('request.end', { status: response.status });
      return response;
    } catch (error) {
      return jsonError(error, correlationId, log);
    }
  };
}

/** Wrap a handler that requires authentication; injects the `AuthUser`. */
export function withAuthedRoute<P = Record<string, never>>(handler: AuthedHandler<P>) {
  return withRoute<P>(async (req, ctx, segment) => {
    const user = await requireAuthUser();
    const authedCtx: AuthedRequestContext = { ...ctx, user };
    authedCtx.logger = ctx.logger.child({ userId: user.id });
    return handler(req, authedCtx, segment);
  });
}
