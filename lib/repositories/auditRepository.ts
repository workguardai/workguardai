/**
 * Audit & activity log repository.
 *
 * Responsibility: Append immutable audit records (security-relevant actions with
 * actor, resource and metadata) and human-readable activity entries. Both are
 * write-mostly and never mutated.
 */
import type { Prisma } from '@prisma/client';

import { defaultDb, type DbClient } from '@/lib/repositories/types';

export interface AuditInput {
  organizationId: string | null;
  userId: string | null;
  action: string;
  resourceType: string;
  resourceId: string | null;
  metadata?: Prisma.InputJsonValue;
  ip?: string | null;
}

export const auditRepository = {
  async record(input: AuditInput, db: DbClient = defaultDb): Promise<void> {
    await db.auditLog.create({
      data: {
        organizationId: input.organizationId,
        userId: input.userId,
        action: input.action,
        resourceType: input.resourceType,
        resourceId: input.resourceId,
        metadata: input.metadata,
        ip: input.ip ?? null,
      },
    });
  },

  async activity(
    input: { organizationId: string | null; userId: string | null; message: string },
    db: DbClient = defaultDb,
  ): Promise<void> {
    await db.activityLog.create({ data: input });
  },
};
