/**
 * POST /api/auth/login — email/password sign-in. Supabase sets secure session
 * cookies (and handles refresh rotation) via the cookie-bound server client.
 */
import { withRoute } from '@/lib/http/handler';
import { jsonOk } from '@/lib/http/response';
import { parseJsonBody } from '@/lib/http/validate';
import { loginRequest, authUserDto } from '@/schemas/auth';
import { authService } from '@/services/authService';

export const POST = withRoute(async (req, ctx) => {
  const input = await parseJsonBody(req, loginRequest);
  const user = await authService.login(input);
  return jsonOk(authUserDto, user, { correlationId: ctx.correlationId });
});
