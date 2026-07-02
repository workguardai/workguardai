/**
 * GET /api/notifications — the current user's notifications (paginated).
 */
import { withAuthedRoute } from '@/lib/http/handler';
import { jsonOk } from '@/lib/http/response';
import { parseQuery } from '@/lib/http/validate';
import { paginationQuery } from '@/schemas/common';
import { notificationListDto } from '@/schemas/insights';
import { notificationService } from '@/services/notificationService';

export const GET = withAuthedRoute(async (req, ctx) => {
  const pagination = parseQuery(req, paginationQuery);
  const { items, total } = await notificationService.list(ctx.user, pagination);
  return jsonOk(notificationListDto, items, {
    correlationId: ctx.correlationId,
    meta: { page: pagination.page, pageSize: pagination.pageSize, total },
  });
});
