/**
 * GET /api/sites/[siteId]/dashboard — the latest dashboard snapshot for a site.
 * Pilot tiers receive a watermarked preview payload with locked premium cards.
 */
import { z } from 'zod';

import { withAuthedRoute } from '@/lib/http/handler';
import { jsonOk } from '@/lib/http/response';
import { parseParams } from '@/lib/http/validate';
import { dashboardResponse } from '@/schemas/insights';
import { dashboardService } from '@/services/dashboardService';

const paramsSchema = z.object({ siteId: z.string().min(1) });

type Params = { siteId: string };

export const GET = withAuthedRoute<Params>(async (_req, ctx, segment) => {
  const { siteId } = parseParams(await segment.params, paramsSchema);
  const dashboard = await dashboardService.getLatest(ctx.user, siteId);
  return jsonOk(dashboardResponse, dashboard, { correlationId: ctx.correlationId });
});
