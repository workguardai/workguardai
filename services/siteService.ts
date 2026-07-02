/**
 * Site service.
 *
 * Responsibility: Create and list sites within a project. Requires the caller to
 * hold the MANAGE_SITE capability on the project; Pilot tier caps sites per org.
 */
import { prisma } from '@/lib/prisma';
import { AuditAction } from '@/lib/constants';
import { Capability } from '@/lib/auth/rbac';
import { requireCapabilityOnProject } from '@/lib/auth/authorization';
import { projectRepository } from '@/lib/repositories/projectRepository';
import { siteRepository } from '@/lib/repositories/siteRepository';
import { billingRepository } from '@/lib/repositories/billingRepository';
import { auditRepository } from '@/lib/repositories/auditRepository';
import { usageService } from '@/services/usageService';
import { NotFoundError } from '@/lib/errors';
import type { AuthUser } from '@/types';
import type { CreateSiteRequest } from '@/schemas/tenancy';

function toDto(s: {
  id: string;
  projectId: string;
  name: string;
  location: string | null;
  createdAt: Date;
}) {
  return {
    id: s.id,
    projectId: s.projectId,
    name: s.name,
    location: s.location,
    createdAt: s.createdAt.toISOString(),
  };
}

export const siteService = {
  async create(user: AuthUser, input: CreateSiteRequest) {
    await requireCapabilityOnProject(user.id, input.projectId, Capability.MANAGE_SITE);

    const project = await projectRepository.findById(input.projectId);
    if (!project) {
      throw new NotFoundError('Project not found');
    }
    await usageService.assertCanCreateSite(project.organizationId);

    const site = await prisma.$transaction(async (tx) => {
      const created = await siteRepository.create(
        { projectId: input.projectId, name: input.name, location: input.location ?? null },
        tx,
      );
      await billingRepository.incrementUsage(project.organizationId, 'siteCount', 1, tx);
      await auditRepository.record(
        {
          organizationId: project.organizationId,
          userId: user.id,
          action: AuditAction.SITE_CREATED,
          resourceType: 'Site',
          resourceId: created.id,
        },
        tx,
      );
      return created;
    });

    return toDto(site);
  },

  async listByProject(user: AuthUser, projectId: string) {
    await requireCapabilityOnProject(user.id, projectId, Capability.VIEW_DASHBOARD);
    const sites = await siteRepository.listByProject(projectId);
    return sites.map(toDto);
  },
};
