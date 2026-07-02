/**
 * Health check endpoint (public).
 *
 * GET /api/health -> { status, time }. Used for uptime checks. No auth, no DB.
 */
import { z } from 'zod';

import { withRoute } from '@/lib/http/handler';
import { jsonOk } from '@/lib/http/response';

const dataSchema = z.object({ status: z.literal('ok'), time: z.string() });

export const GET = withRoute(async (_req, ctx) => {
  return jsonOk(
    dataSchema,
    { status: 'ok', time: new Date().toISOString() },
    { correlationId: ctx.correlationId },
  );
});
