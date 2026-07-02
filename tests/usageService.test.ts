/**
 * Tests for tier-limit enforcement. The billing repository is mocked so no DB is
 * touched; we assert the pilot caps and the unlimited mapping for higher tiers.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SubscriptionTier, SubscriptionStatus } from '@prisma/client';

vi.mock('@/lib/repositories/billingRepository', () => ({
  billingRepository: {
    findSubscription: vi.fn(),
    findUsage: vi.fn(),
  },
}));

import { billingRepository } from '@/lib/repositories/billingRepository';
import { usageService } from '@/services/usageService';
import { LimitExceededError } from '@/lib/errors';
import { PilotLimits } from '@/lib/constants';

const mockedFindSubscription = vi.mocked(billingRepository.findSubscription);
const mockedFindUsage = vi.mocked(billingRepository.findUsage);

function subscription(tier: SubscriptionTier) {
  return {
    id: 's1',
    organizationId: 'org1',
    tier,
    status: SubscriptionStatus.ACTIVE,
    currentPeriodEnd: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

function usage(overrides: Partial<{ projectCount: number }>) {
  return {
    id: 'u1',
    organizationId: 'org1',
    projectCount: 0,
    siteCount: 0,
    drawingCount: 0,
    aiEvaluationCount: 0,
    alertCount: 0,
    periodStart: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('usageService.limitsForTier', () => {
  it('constrains Pilot to the pilot caps', () => {
    expect(usageService.limitsForTier(SubscriptionTier.PILOT).maxProjects).toBe(
      PilotLimits.MAX_PROJECTS,
    );
  });

  it('treats Pro as unlimited', () => {
    expect(usageService.limitsForTier(SubscriptionTier.PRO).maxProjects).toBe(
      Number.POSITIVE_INFINITY,
    );
  });
});

describe('usageService.assertCanCreateProject', () => {
  it('allows a Pilot org under the project cap', async () => {
    mockedFindSubscription.mockResolvedValue(subscription(SubscriptionTier.PILOT));
    mockedFindUsage.mockResolvedValue(usage({ projectCount: 0 }));
    await expect(usageService.assertCanCreateProject('org1')).resolves.toBeUndefined();
  });

  it('blocks a Pilot org at the project cap', async () => {
    mockedFindSubscription.mockResolvedValue(subscription(SubscriptionTier.PILOT));
    mockedFindUsage.mockResolvedValue(usage({ projectCount: PilotLimits.MAX_PROJECTS }));
    await expect(usageService.assertCanCreateProject('org1')).rejects.toBeInstanceOf(
      LimitExceededError,
    );
  });

  it('never blocks a Pro org', async () => {
    mockedFindSubscription.mockResolvedValue(subscription(SubscriptionTier.PRO));
    mockedFindUsage.mockResolvedValue(usage({ projectCount: 999 }));
    await expect(usageService.assertCanCreateProject('org1')).resolves.toBeUndefined();
  });
});
