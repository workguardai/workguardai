/**
 * POST /api/auth/logout — clears the Supabase session cookies.
 */
import { z } from 'zod';

import { withRoute } from '@/lib/http/handler';
import { jsonOk } from '@/lib/http/response';
import { authService } from '@/services/authService';

const dataSchema = z.object({ signedOut: z.literal(true) });

export const POST = withRoute(async (_req, ctx) => {
  await authService.logout();
  return jsonOk(dataSchema, { signedOut: true }, { correlationId: ctx.correlationId });
});
