/**
 * Site repository.
 *
 * Responsibility: CRUD for sites (the operational unit). `findByIdWithProject`
 * eagerly loads the parent project so services can resolve the owning
 * organization for authorization and usage-limit checks in one query.
 */
import type { Prisma, Site } from '@prisma/client';

import { defaultDb, type DbClient } from '@/lib/repositories/types';

/** A site joined with its parent project (for org resolution). */
export type SiteWithProject = Prisma.SiteGetPayload<{ include: { project: true } }>;

export const siteRepository = {
  async create(
    input: { projectId: string; name: string; location: string | null },
    db: DbClient = defaultDb,
  ): Promise<Site> {
    return db.site.create({ data: input });
  },

  async countActiveByProject(projectId: string, db: DbClient = defaultDb): Promise<number> {
    return db.site.count({ where: { projectId, deletedAt: null } });
  },

  async listByProject(projectId: string, db: DbClient = defaultDb): Promise<Site[]> {
    return db.site.findMany({
      where: { projectId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  },

  async findByIdWithProject(
    id: string,
    db: DbClient = defaultDb,
  ): Promise<SiteWithProject | null> {
    return db.site.findFirst({
      where: { id, deletedAt: null },
      include: { project: true },
    });
  },
};
