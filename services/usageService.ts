/**
 * Usage & tier-limit service.
 *
 * Responsibility: Enforce subscription-tier usage limits before a resource is
 * created, and expose the effective limits for the subscription endpoint. Pilot
 * (and Free) tiers are intentionally constrained per CLAUDE.md; Pro/Enterprise
 * are effectively unlimited here (billing integration is out of scope).
 *
 * All checks read the organization's `Subscription` (tier) and `Usage` counters.
 * Counters are incremented by the calling service inside its transaction.
 */
import { SubscriptionTier } from '@prisma/client';

import { LimitExceededError, NotFoundError } from '@/lib/errors';
import { PilotLimits } from '@/lib/constants';
import { billingRepository } from '@/lib/repositories/billingRepository';

export interface TierLimits {
  maxProjects: number;
  maxSites: number;
  maxDrawings: number;
  maxAiEvaluations: number;
  maxAlerts: number;
}

const UNLIMITED = Number.POSITIVE_INFINITY;

const PILOT_TIER_LIMITS: TierLimits = {
  maxProjects: PilotLimits.MAX_PROJECTS,
  maxSites: PilotLimits.MAX_SITES,
  maxDrawings: PilotLimits.MAX_DRAWINGS,
  maxAiEvaluations: PilotLimits.MAX_AI_EVALUATIONS,
  maxAlerts: PilotLimits.MAX_ALERTS,
};

const UNLIMITED_TIER_LIMITS: TierLimits = {
  maxProjects: UNLIMITED,
  maxSites: UNLIMITED,
  maxDrawings: UNLIMITED,
  maxAiEvaluations: UNLIMITED,
  maxAlerts: UNLIMITED,
};

/** Effective limits for a tier. Free and Pilot share the constrained set. */
export function limitsForTier(tier: SubscriptionTier): TierLimits {
  switch (tier) {
    case SubscriptionTier.FREE:
    case SubscriptionTier.PILOT:
      return PILOT_TIER_LIMITS;
    case SubscriptionTier.PRO:
    case SubscriptionTier.ENTERPRISE:
      return UNLIMITED_TIER_LIMITS;
    default: {
      const _never: never = tier;
      throw new Error(`Unknown tier: ${String(_never)}`);
    }
  }
}

async function loadTierAndLimits(organizationId: string): Promise<TierLimits> {
  const subscription = await billingRepository.findSubscription(organizationId);
  if (!subscription) {
    throw new NotFoundError('Subscription not found for organization');
  }
  return limitsForTier(subscription.tier);
}

async function currentUsage(organizationId: string) {
  const usage = await billingRepository.findUsage(organizationId);
  if (!usage) {
    throw new NotFoundError('Usage record not found for organization');
  }
  return usage;
}

function assertBelow(current: number, max: number, resource: string): void {
  if (current >= max) {
    throw new LimitExceededError(
      `Your plan limit for ${resource} has been reached. Upgrade to add more.`,
      { current, max, resource },
    );
  }
}

export const usageService = {
  limitsForTier,

  async assertCanCreateProject(organizationId: string): Promise<void> {
    const [limits, usage] = await Promise.all([
      loadTierAndLimits(organizationId),
      currentUsage(organizationId),
    ]);
    assertBelow(usage.projectCount, limits.maxProjects, 'projects');
  },

  async assertCanCreateSite(organizationId: string): Promise<void> {
    const [limits, usage] = await Promise.all([
      loadTierAndLimits(organizationId),
      currentUsage(organizationId),
    ]);
    assertBelow(usage.siteCount, limits.maxSites, 'sites');
  },

  async assertCanUploadDrawing(organizationId: string): Promise<void> {
    const [limits, usage] = await Promise.all([
      loadTierAndLimits(organizationId),
      currentUsage(organizationId),
    ]);
    assertBelow(usage.drawingCount, limits.maxDrawings, 'drawings');
  },

  async assertCanEvaluate(organizationId: string): Promise<void> {
    const [limits, usage] = await Promise.all([
      loadTierAndLimits(organizationId),
      currentUsage(organizationId),
    ]);
    assertBelow(usage.aiEvaluationCount, limits.maxAiEvaluations, 'AI evaluations');
  },

  /** Remaining alerts the org may persist before hitting its cap (Infinity if unlimited). */
  async remainingAlertCapacity(organizationId: string): Promise<number> {
    const [limits, usage] = await Promise.all([
      loadTierAndLimits(organizationId),
      currentUsage(organizationId),
    ]);
    return Math.max(0, limits.maxAlerts - usage.alertCount);
  },
};
