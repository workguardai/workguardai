/**
 * GET /api/sites/[siteId]/alerts — paginated alerts for a site.
 */
import { z } from 'zod';

import { withAuthedRoute } from '@/lib/http/handler';
import { jsonOk } from '@/lib/http/response';
import { parseParams, parseQuery } from '@/lib/http/validate';
import { paginationQuery } from '@/schemas/common';
import { alertListDto } from '@/schemas/insights';
import { alertService } from '@/services/alertService';

const paramsSchema = z.object({ siteId: z.string().min(1) });

type Params = { siteId: string };

export const GET = withAuthedRoute<Params>(async (req, ctx, segment) => {
  const { siteId } = parseParams(await segment.params, paramsSchema);
  const pagination = parseQuery(req, paginationQuery);
  const { items, total } = await alertService.listBySite(ctx.user, siteId, pagination);
  return jsonOk(alertListDto, items, {
    correlationId: ctx.correlationId,
    meta: { page: pagination.page, pageSize: pagination.pageSize, total },
  });
});
