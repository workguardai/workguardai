/**
 * Resource authorization.
 *
 * Responsibility: Combine RBAC predicates with ownership/membership lookups to
 * authorize a user against a specific resource. Every write path calls one of
 * these guards; the proxy is only a coarse first line of defense.
 *
 * Model:
 *  - Organizations are owned by a User (`ownerId`).
 *  - Projects belong to an org; project membership assigns a `Role`.
 *  - The project creator is added as an ADMIN member, so all project/site/drawing
 *    checks are membership-based.
 */
import type { Organization, Role } from '@prisma/client';

import { ForbiddenError, NotFoundError } from '@/lib/errors';
import { assertCan, type Capability } from '@/lib/auth/rbac';
import { organizationRepository } from '@/lib/repositories/organizationRepository';
import { projectRepository } from '@/lib/repositories/projectRepository';
import { siteRepository, type SiteWithProject } from '@/lib/repositories/siteRepository';

/** Require the user to own the organization. */
export async function requireOrgOwner(
  userId: string,
  organizationId: string,
): Promise<Organization> {
  const org = await organizationRepository.findOwnedById(organizationId, userId);
  if (!org) {
    // Do not distinguish "missing" from "not yours" to avoid resource probing.
    throw new NotFoundError('Organization not found');
  }
  return org;
}

/** Resolve and authorize the caller's role on a project for a capability. */
export async function requireCapabilityOnProject(
  userId: string,
  projectId: string,
  capability: Capability,
): Promise<Role> {
  const project = await projectRepository.findById(projectId);
  if (!project) {
    throw new NotFoundError('Project not found');
  }
  const membership = await projectRepository.findMembership(projectId, userId);
  if (!membership) {
    throw new ForbiddenError('You are not a member of this project');
  }
  assertCan(membership.role, capability);
  return membership.role;
}

export interface SiteAccess {
  site: SiteWithProject;
  role: Role;
}

/** Resolve a site, authorize the caller via its project membership. */
export async function requireCapabilityOnSite(
  userId: string,
  siteId: string,
  capability: Capability,
): Promise<SiteAccess> {
  const site = await siteRepository.findByIdWithProject(siteId);
  if (!site) {
    throw new NotFoundError('Site not found');
  }
  const role = await requireCapabilityOnProject(userId, site.projectId, capability);
  return { site, role };
}
