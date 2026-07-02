/**
 * POST /api/auth/register — email/password sign-up via Supabase Auth.
 */
import { withRoute } from '@/lib/http/handler';
import { jsonOk } from '@/lib/http/response';
import { parseJsonBody } from '@/lib/http/validate';
import { registerRequest, registerResponse } from '@/schemas/auth';
import { authService } from '@/services/authService';

export const POST = withRoute(async (req, ctx) => {
  const input = await parseJsonBody(req, registerRequest);
  const result = await authService.register(input);
  return jsonOk(registerResponse, result, { correlationId: ctx.correlationId, status: 201 });
});
