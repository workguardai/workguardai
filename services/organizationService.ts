/**
 * Organization service.
 *
 * Responsibility: Create and list organizations. Creating an org provisions its
 * Pilot subscription and usage record atomically. The platform currently offers
 * only the Pilot tier publicly, so each user is capped at one organization.
 */
import { SubscriptionTier } from '@prisma/client';

import { prisma } from '@/lib/prisma';
import { LimitExceededError } from '@/lib/errors';
import { AuditAction, PilotLimits } from '@/lib/constants';
import { organizationRepository } from '@/lib/repositories/organizationRepository';
import { billingRepository } from '@/lib/repositories/billingRepository';
import { auditRepository } from '@/lib/repositories/auditRepository';
import { userRepository } from '@/lib/repositories/userRepository';
import type { AuthUser } from '@/types';
import type { CreateOrganizationRequest } from '@/schemas/tenancy';

function toDto(org: { id: string; name: string; createdAt: Date }) {
  return { id: org.id, name: org.name, createdAt: org.createdAt.toISOString() };
}

export const organizationService = {
  async create(user: AuthUser, input: CreateOrganizationRequest) {
    // Ensure the local user mirror exists before creating owned resources.
    await userRepository.upsert(user);

    const existing = await organizationRepository.countActiveByOwner(user.id);
    if (existing >= PilotLimits.MAX_ORGANIZATIONS) {
      throw new LimitExceededError(
        'The Pilot plan allows a single organization. Upgrade to add more.',
        { current: existing, max: PilotLimits.MAX_ORGANIZATIONS },
      );
    }

    const org = await prisma.$transaction(async (tx) => {
      const created = await organizationRepository.create(
        { name: input.name, ownerId: user.id },
        tx,
      );
      await billingRepository.createSubscription(
        { organizationId: created.id, tier: SubscriptionTier.PILOT },
        tx,
      );
      await billingRepository.createUsage(created.id, tx);
      await auditRepository.record(
        {
          organizationId: created.id,
          userId: user.id,
          action: AuditAction.ORGANIZATION_CREATED,
          resourceType: 'Organization',
          resourceId: created.id,
        },
        tx,
      );
      return created;
    });

    return toDto(org);
  },

  async list(user: AuthUser) {
    const orgs = await organizationRepository.listByOwner(user.id);
    return orgs.map(toDto);
  },
};
