/**
 * /api/organizations
 *  GET  — list the caller's organizations.
 *  POST — create an organization (provisions Pilot subscription + usage).
 */
import { withAuthedRoute } from '@/lib/http/handler';
import { jsonOk } from '@/lib/http/response';
import { parseJsonBody } from '@/lib/http/validate';
import { createOrganizationRequest, organizationDto, organizationListDto } from '@/schemas/tenancy';
import { organizationService } from '@/services/organizationService';

export const GET = withAuthedRoute(async (_req, ctx) => {
  const orgs = await organizationService.list(ctx.user);
  return jsonOk(organizationListDto, orgs, { correlationId: ctx.correlationId });
});

export const POST = withAuthedRoute(async (req, ctx) => {
  const input = await parseJsonBody(req, createOrganizationRequest);
  const org = await organizationService.create(ctx.user, input);
  return jsonOk(organizationDto, org, { correlationId: ctx.correlationId, status: 201 });
});
