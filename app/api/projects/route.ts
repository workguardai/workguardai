/**
 * /api/projects
 *  GET  ?organizationId= — list projects in an organization the caller owns.
 *  POST — create a project (caller becomes ADMIN member).
 */
import { withAuthedRoute } from '@/lib/http/handler';
import { jsonOk } from '@/lib/http/response';
import { parseJsonBody, parseQuery } from '@/lib/http/validate';
import {
  createProjectRequest,
  listProjectsQuery,
  projectDto,
  projectListDto,
} from '@/schemas/tenancy';
import { projectService } from '@/services/projectService';

export const GET = withAuthedRoute(async (req, ctx) => {
  const { organizationId } = parseQuery(req, listProjectsQuery);
  const projects = await projectService.listByOrganization(ctx.user, organizationId);
  return jsonOk(projectListDto, projects, { correlationId: ctx.correlationId });
});

export const POST = withAuthedRoute(async (req, ctx) => {
  const input = await parseJsonBody(req, createProjectRequest);
  const project = await projectService.create(ctx.user, input);
  return jsonOk(projectDto, project, { correlationId: ctx.correlationId, status: 201 });
});
