/**
 * Subscription service.
 *
 * Responsibility: Report an organization's current tier, status, usage counters
 * and effective limits so clients can render upgrade prompts. Authorized to the
 * org owner.
 */
import { NotFoundError } from '@/lib/errors';
import { requireOrgOwner } from '@/lib/auth/authorization';
import { billingRepository } from '@/lib/repositories/billingRepository';
import { usageService } from '@/services/usageService';
import type { AuthUser } from '@/types';

export const subscriptionService = {
  async get(user: AuthUser, organizationId: string) {
    await requireOrgOwner(user.id, organizationId);

    const [subscription, usage] = await Promise.all([
      billingRepository.findSubscription(organizationId),
      billingRepository.findUsage(organizationId),
    ]);
    if (!subscription || !usage) {
      throw new NotFoundError('Subscription not found for organization');
    }

    const limits = usageService.limitsForTier(subscription.tier);
    // The API represents "unlimited" as -1 (Infinity is not JSON/int-safe).
    const asApiLimit = (n: number): number => (Number.isFinite(n) ? n : -1);

    return {
      organizationId,
      tier: subscription.tier,
      status: subscription.status,
      usage: {
        projectCount: usage.projectCount,
        siteCount: usage.siteCount,
        drawingCount: usage.drawingCount,
        aiEvaluationCount: usage.aiEvaluationCount,
        alertCount: usage.alertCount,
      },
      limits: {
        maxProjects: asApiLimit(limits.maxProjects),
        maxSites: asApiLimit(limits.maxSites),
        maxDrawings: asApiLimit(limits.maxDrawings),
        maxAiEvaluations: asApiLimit(limits.maxAiEvaluations),
        maxAlerts: asApiLimit(limits.maxAlerts),
      },
    };
  },
};
