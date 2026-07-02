/**
 * Project service.
 *
 * Responsibility: Create and list projects within an organization. The creator
 * must own the org; on creation they are added as an ADMIN member so subsequent
 * project-scoped RBAC is membership-based. Pilot tier caps projects per org.
 */
import { Role } from '@prisma/client';

import { prisma } from '@/lib/prisma';
import { AuditAction } from '@/lib/constants';
import { requireOrgOwner } from '@/lib/auth/authorization';
import { projectRepository } from '@/lib/repositories/projectRepository';
import { billingRepository } from '@/lib/repositories/billingRepository';
import { auditRepository } from '@/lib/repositories/auditRepository';
import { usageService } from '@/services/usageService';
import type { AuthUser } from '@/types';
import type { CreateProjectRequest } from '@/schemas/tenancy';

function toDto(p: {
  id: string;
  organizationId: string;
  name: string;
  description: string | null;
  createdAt: Date;
}) {
  return {
    id: p.id,
    organizationId: p.organizationId,
    name: p.name,
    description: p.description,
    createdAt: p.createdAt.toISOString(),
  };
}

export const projectService = {
  async create(user: AuthUser, input: CreateProjectRequest) {
    await requireOrgOwner(user.id, input.organizationId);
    await usageService.assertCanCreateProject(input.organizationId);

    const project = await prisma.$transaction(async (tx) => {
      const created = await projectRepository.create(
        {
          organizationId: input.organizationId,
          name: input.name,
          description: input.description ?? null,
        },
        tx,
      );
      await projectRepository.addMember(
        { projectId: created.id, userId: user.id, role: Role.ADMIN },
        tx,
      );
      await billingRepository.incrementUsage(input.organizationId, 'projectCount', 1, tx);
      await auditRepository.record(
        {
          organizationId: input.organizationId,
          userId: user.id,
          action: AuditAction.PROJECT_CREATED,
          resourceType: 'Project',
          resourceId: created.id,
        },
        tx,
      );
      return created;
    });

    return toDto(project);
  },

  async listByOrganization(user: AuthUser, organizationId: string) {
    await requireOrgOwner(user.id, organizationId);
    const projects = await projectRepository.listByOrg(organizationId);
    return projects.map(toDto);
  },
};
