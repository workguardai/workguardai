/**
 * Billing repository (subscription + usage).
 *
 * Responsibility: Persist a per-organization `Subscription` (tier/status) and
 * the `Usage` counters that back tier-limit enforcement. Counters are mutated
 * with atomic `increment` to avoid read-modify-write races.
 */
import type { Prisma, Subscription, SubscriptionTier, Usage } from '@prisma/client';

import { defaultDb, type DbClient } from '@/lib/repositories/types';

/** Usage counter fields that services may atomically increment. */
export type UsageCounter = 'projectCount' | 'siteCount' | 'drawingCount' | 'aiEvaluationCount' | 'alertCount';

export const billingRepository = {
  async createSubscription(
    input: { organizationId: string; tier: SubscriptionTier },
    db: DbClient = defaultDb,
  ): Promise<Subscription> {
    return db.subscription.create({
      data: { organizationId: input.organizationId, tier: input.tier },
    });
  },

  async findSubscription(
    organizationId: string,
    db: DbClient = defaultDb,
  ): Promise<Subscription | null> {
    return db.subscription.findUnique({ where: { organizationId } });
  },

  async createUsage(organizationId: string, db: DbClient = defaultDb): Promise<Usage> {
    return db.usage.create({ data: { organizationId } });
  },

  async findUsage(organizationId: string, db: DbClient = defaultDb): Promise<Usage | null> {
    return db.usage.findUnique({ where: { organizationId } });
  },

  /** Atomically increment a usage counter by `amount` (default 1). */
  async incrementUsage(
    organizationId: string,
    counter: UsageCounter,
    amount = 1,
    db: DbClient = defaultDb,
  ): Promise<Usage> {
    const data: Prisma.UsageUpdateInput = { [counter]: { increment: amount } };
    return db.usage.update({ where: { organizationId }, data });
  },
};
