/**
 * GET /api/subscription?organizationId= — tier, status, usage counters and the
 * effective plan limits for an organization the caller owns. `-1` means unlimited.
 */
import { z } from 'zod';

import { withAuthedRoute } from '@/lib/http/handler';
import { jsonOk } from '@/lib/http/response';
import { parseQuery } from '@/lib/http/validate';
import { subscriptionResponse } from '@/schemas/insights';
import { subscriptionService } from '@/services/subscriptionService';

const querySchema = z.object({ organizationId: z.string().min(1) });

export const GET = withAuthedRoute(async (req, ctx) => {
  const { organizationId } = parseQuery(req, querySchema);
  const subscription = await subscriptionService.get(ctx.user, organizationId);
  return jsonOk(subscriptionResponse, subscription, { correlationId: ctx.correlationId });
});
