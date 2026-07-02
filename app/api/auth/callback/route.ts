/**
 * GET /api/auth/callback — OAuth redirect target. Exchanges the authorization
 * code for a Supabase session (setting cookies) and redirects into the app.
 * On failure, redirects to /login with an error flag rather than leaking detail.
 */
import { withRoute } from '@/lib/http/handler';
import { authService } from '@/services/authService';

export const GET = withRoute(async (req) => {
  const code = req.nextUrl.searchParams.get('code');
  const origin = req.nextUrl.origin;

  if (!code) {
    return Response.redirect(new URL('/login?error=missing_code', origin).toString(), 302);
  }

  try {
    await authService.exchangeOAuthCode(code);
    return Response.redirect(new URL('/dashboard', origin).toString(), 302);
  } catch {
    return Response.redirect(new URL('/login?error=oauth', origin).toString(), 302);
  }
});
