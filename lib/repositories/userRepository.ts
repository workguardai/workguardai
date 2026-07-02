/**
 * User repository.
 *
 * Responsibility: Persist the local mirror of a Supabase Auth user. The `id`
 * equals the Supabase auth UUID, so upsert is keyed on it. All FK relations
 * (org ownership, memberships) require this row to exist.
 */
import type { User } from '@prisma/client';

import { defaultDb, type DbClient } from '@/lib/repositories/types';
import type { AuthUser } from '@/types';

export const userRepository = {
  /** Create or update the local user mirror from a validated auth identity. */
  async upsert(authUser: AuthUser, db: DbClient = defaultDb): Promise<User> {
    return db.user.upsert({
      where: { id: authUser.id },
      create: {
        id: authUser.id,
        email: authUser.email,
        fullName: authUser.fullName,
      },
      update: {
        email: authUser.email,
        fullName: authUser.fullName,
      },
    });
  },

  async findById(id: string, db: DbClient = defaultDb): Promise<User | null> {
    return db.user.findUnique({ where: { id } });
  },
};
