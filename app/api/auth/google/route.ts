/**
 * GET /api/auth/google — begin Google OAuth. Redirects the browser to the
 * provider consent screen; the provider returns to /api/auth/callback.
 */
import { withRoute } from '@/lib/http/handler';
import { authService } from '@/services/authService';

export const GET = withRoute(async (req) => {
  const redirectTo = new URL('/api/auth/callback', req.nextUrl.origin).toString();
  const url = await authService.getGoogleAuthUrl(redirectTo);
  return Response.redirect(url, 302);
});
