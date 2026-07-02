/**
 * Proxy (Next.js 16 successor to `middleware.ts`).
 *
 * NOTE: In Next.js 16 the `middleware` file convention is deprecated and renamed
 * to `proxy`. This file fulfills the blueprint's "middleware protection" step
 * using the current convention. Per Next.js guidance, the proxy performs only
 * coarse, best-effort gating and cross-cutting header work; authoritative
 * authorization is enforced inside every Route Handler/service (`withAuthedRoute`
 * + RBAC), never solely here.
 *
 * Responsibilities:
 *  - Ensure every request carries a correlation ID (generated if absent) so logs
 *    can be traced end-to-end.
 *  - Attach baseline security headers to responses.
 *  - Redirect unauthenticated browser navigations away from protected app pages
 *    (a lightweight cookie-presence check only; API auth is verified in handlers).
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { HttpHeader } from '@/lib/constants';

/** App page prefixes that require a session for browser navigation. */
const PROTECTED_PAGE_PREFIXES = ['/dashboard', '/onboarding'] as const;

/** Supabase stores its auth token in cookies prefixed like this. */
const SUPABASE_AUTH_COOKIE_HINT = 'sb-';

function hasSupabaseSessionCookie(req: NextRequest): boolean {
  return req.cookies.getAll().some((c) => c.name.startsWith(SUPABASE_AUTH_COOKIE_HINT));
}

function withSecurityHeaders(res: NextResponse, correlationId: string): NextResponse {
  res.headers.set(HttpHeader.CORRELATION_ID, correlationId);
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('X-DNS-Prefetch-Control', 'off');
  return res;
}

export function proxy(request: NextRequest): NextResponse {
  const correlationId =
    request.headers.get(HttpHeader.CORRELATION_ID) ?? crypto.randomUUID();

  const { pathname } = request.nextUrl;
  const isProtectedPage = PROTECTED_PAGE_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (isProtectedPage && !hasSupabaseSessionCookie(request)) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return withSecurityHeaders(NextResponse.redirect(loginUrl), correlationId);
  }

  // Propagate the correlation ID to downstream handlers via request headers.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(HttpHeader.CORRELATION_ID, correlationId);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  return withSecurityHeaders(response, correlationId);
}

export const config = {
  // Run on everything except Next internals and static assets.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'],
};
