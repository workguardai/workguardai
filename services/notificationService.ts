/**
 * Notification service (read side).
 *
 * Responsibility: List the current user's notifications (paginated). Creation
 * happens in the evaluation pipeline; realtime delivery is intentionally out of
 * scope (abstracted for the future).
 */
import type { Notification } from '@prisma/client';

import { notificationRepository } from '@/lib/repositories/notificationRepository';
import type { AuthUser } from '@/types';
import type { PaginationQuery } from '@/schemas/common';

function toDto(n: Notification) {
  return {
    id: n.id,
    title: n.title,
    body: n.body,
    status: n.status,
    alertId: n.alertId,
    createdAt: n.createdAt.toISOString(),
  };
}

export const notificationService = {
  async list(user: AuthUser, pagination: PaginationQuery) {
    const skip = (pagination.page - 1) * pagination.pageSize;
    const { items, total } = await notificationRepository.listByUser(user.id, {
      skip,
      take: pagination.pageSize,
    });
    return { items: items.map(toDto), total };
  },
};
