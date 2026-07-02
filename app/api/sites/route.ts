/**
 * /api/sites
 *  GET  ?projectId= — list sites in a project the caller can view.
 *  POST — create a site (requires MANAGE_SITE on the project).
 */
import { withAuthedRoute } from '@/lib/http/handler';
import { jsonOk } from '@/lib/http/response';
import { parseJsonBody, parseQuery } from '@/lib/http/validate';
import { createSiteRequest, listSitesQuery, siteDto, siteListDto } from '@/schemas/tenancy';
import { siteService } from '@/services/siteService';

export const GET = withAuthedRoute(async (req, ctx) => {
  const { projectId } = parseQuery(req, listSitesQuery);
  const sites = await siteService.listByProject(ctx.user, projectId);
  return jsonOk(siteListDto, sites, { correlationId: ctx.correlationId });
});

export const POST = withAuthedRoute(async (req, ctx) => {
  const input = await parseJsonBody(req, createSiteRequest);
  const site = await siteService.create(ctx.user, input);
  return jsonOk(siteDto, site, { correlationId: ctx.correlationId, status: 201 });
});
