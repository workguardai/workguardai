/**
 * Project repository.
 *
 * Responsibility: CRUD for projects and their membership rows. Membership binds
 * a user to a project with a `Role` used by RBAC. `findMembership` returns the
 * caller's role for authorization decisions in the service layer.
 */
import type { Project, ProjectMember, Role } from '@prisma/client';

import { defaultDb, type DbClient } from '@/lib/repositories/types';

export const projectRepository = {
  async create(
    input: { organizationId: string; name: string; description: string | null },
    db: DbClient = defaultDb,
  ): Promise<Project> {
    return db.project.create({ data: input });
  },

  async countActiveByOrg(organizationId: string, db: DbClient = defaultDb): Promise<number> {
    return db.project.count({ where: { organizationId, deletedAt: null } });
  },

  async listByOrg(organizationId: string, db: DbClient = defaultDb): Promise<Project[]> {
    return db.project.findMany({
      where: { organizationId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  },

  async findById(id: string, db: DbClient = defaultDb): Promise<Project | null> {
    return db.project.findFirst({ where: { id, deletedAt: null } });
  },

  async addMember(
    input: { projectId: string; userId: string; role: Role },
    db: DbClient = defaultDb,
  ): Promise<ProjectMember> {
    return db.projectMember.create({ data: input });
  },

  /** The caller's role in a project, or null if not a member. */
  async findMembership(
    projectId: string,
    userId: string,
    db: DbClient = defaultDb,
  ): Promise<ProjectMember | null> {
    return db.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId } },
    });
  },

  async listMembershipsForUser(
    userId: string,
    db: DbClient = defaultDb,
  ): Promise<ProjectMember[]> {
    return db.projectMember.findMany({ where: { userId } });
  },
};
