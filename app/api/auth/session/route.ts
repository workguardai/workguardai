/**
 * GET /api/auth/session — the current user and their project memberships.
 * Throws 401 if unauthenticated.
 */
import { withRoute } from '@/lib/http/handler';
import { jsonOk } from '@/lib/http/response';
import { sessionResponse } from '@/schemas/auth';
import { authService } from '@/services/authService';

export const GET = withRoute(async (_req, ctx) => {
  const session = await authService.currentSession();
  return jsonOk(sessionResponse, session, { correlationId: ctx.correlationId });
});
