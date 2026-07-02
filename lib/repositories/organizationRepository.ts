/**
 * Organization repository.
 *
 * Responsibility: CRUD for organizations (soft-deletable). Ownership is by
 * `ownerId` (a User). Tenancy limits (pilot: one org) are enforced in services
 * using `countActiveByOwner`.
 */
import type { Organization } from '@prisma/client';

import { defaultDb, type DbClient } from '@/lib/repositories/types';

export const organizationRepository = {
  async create(
    input: { name: string; ownerId: string },
    db: DbClient = defaultDb,
  ): Promise<Organization> {
    return db.organization.create({ data: input });
  },

  async listByOwner(ownerId: string, db: DbClient = defaultDb): Promise<Organization[]> {
    return db.organization.findMany({
      where: { ownerId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  },

  async countActiveByOwner(ownerId: string, db: DbClient = defaultDb): Promise<number> {
    return db.organization.count({ where: { ownerId, deletedAt: null } });
  },

  async findOwnedById(
    id: string,
    ownerId: string,
    db: DbClient = defaultDb,
  ): Promise<Organization | null> {
    return db.organization.findFirst({ where: { id, ownerId, deletedAt: null } });
  },
};
