/**
 * Notification repository.
 *
 * Responsibility: Persist and read user notifications. Notifications are created
 * from alerts during evaluation and read back by the notifications endpoint.
 * Realtime delivery is intentionally out of scope (abstracted for the future).
 */
import type { Notification, NotificationStatus } from '@prisma/client';

import { defaultDb, type DbClient } from '@/lib/repositories/types';

export interface NotificationInput {
  userId: string;
  alertId: string | null;
  title: string;
  body: string;
}

export const notificationRepository = {
  async createMany(items: NotificationInput[], db: DbClient = defaultDb): Promise<number> {
    if (items.length === 0) return 0;
    const result = await db.notification.createMany({ data: items });
    return result.count;
  },

  async listByUser(
    userId: string,
    pagination: { skip: number; take: number },
    status?: NotificationStatus,
    db: DbClient = defaultDb,
  ): Promise<{ items: Notification[]; total: number }> {
    const where = { userId, ...(status ? { status } : {}) };
    const [items, total] = await Promise.all([
      db.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: pagination.skip,
        take: pagination.take,
      }),
      db.notification.count({ where }),
    ]);
    return { items, total };
  },
};
