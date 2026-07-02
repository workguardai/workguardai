/**
 * Dashboard data pipeline.
 *
 * Responsibility: Transform a validated AI `EvaluationResult` into the dashboard
 * payload persisted as a `DashboardSnapshot`, and read the latest snapshot back.
 *
 * Pilot experience: for Pilot/Free tiers the payload is a compelling but limited
 * PREVIEW — premium cards are locked with an upgrade CTA, a clearly-labeled demo
 * section is blended in to showcase potential value, and a watermark is attached.
 * Higher tiers receive the full payload. See CLAUDE.md "Pilot Experience".
 */
import { SubscriptionTier, type Prisma } from '@prisma/client';

import { analyticsRepository } from '@/lib/repositories/analyticsRepository';
import { billingRepository } from '@/lib/repositories/billingRepository';
import { siteRepository } from '@/lib/repositories/siteRepository';
import { Capability } from '@/lib/auth/rbac';
import { requireCapabilityOnSite } from '@/lib/auth/authorization';
import { NotFoundError } from '@/lib/errors';
import { PilotLimits } from '@/lib/constants';
import type { EvaluationResult } from '@/lib/ai/schemas/evaluation';
import type { DbClient } from '@/lib/repositories/types';
import type { AuthUser } from '@/types';

const PILOT_WATERMARK =
  'PILOT PREVIEW — some analytics are sample/demo data blended for illustration. Upgrade to unlock full, live analytics.';

/** A locked premium card shown to Pilot users with an upgrade call to action. */
function lockedCard(title: string) {
  return {
    title,
    locked: true,
    upgradeCta: 'Upgrade to Pro to unlock',
    isDemo: true,
  };
}

/** Clearly-labeled demo content blended into the pilot preview. */
function demoBlend() {
  return {
    label: 'DEMO DATA (illustrative)',
    isDemo: true,
    sampleTrend: [
      { week: 1, expectedPct: 10, actualPct: 8 },
      { week: 2, expectedPct: 25, actualPct: 20 },
      { week: 3, expectedPct: 45, actualPct: 37 },
    ],
  };
}

export interface BuiltDashboard {
  payload: Prisma.InputJsonValue;
  isPreview: boolean;
  watermark: string | null;
}

function isPilotTier(tier: SubscriptionTier): boolean {
  return tier === SubscriptionTier.PILOT || tier === SubscriptionTier.FREE;
}

export const dashboardService = {
  /**
   * Build the dashboard payload from an evaluation result, tailored to the tier.
   * Pure/deterministic given its inputs (no I/O) so it is easy to unit test.
   */
  buildPayload(
    tier: SubscriptionTier,
    result: EvaluationResult,
    context: { siteName: string },
  ): BuiltDashboard {
    const preview = isPilotTier(tier);

    const core = {
      headline: result.dashboard.headline,
      summary: result.dashboard.summary,
      site: context.siteName,
      progress: {
        expectedPct: result.currentProgress.expectedPct,
        actualPct: result.currentProgress.actualPct,
        riskScore: result.currentProgress.riskScore,
        confidence: result.currentProgress.confidence,
        predictedCompletion: result.currentProgress.predictedCompletion ?? null,
      },
      kpis: result.dashboard.kpis,
      milestones: result.milestones.map((m) => ({
        key: m.key,
        title: m.title,
        status: m.status,
        expectedPct: m.expectedPct,
        actualPct: m.actualPct,
      })),
      alertsSummary: {
        total: result.alerts.length,
        bySeverity: result.alerts.reduce<Record<string, number>>((acc, a) => {
          acc[a.severity] = (acc[a.severity] ?? 0) + 1;
          return acc;
        }, {}),
      },
    };

    if (!preview) {
      return {
        payload: {
          ...core,
          isPreview: false,
          risks: result.risks,
          recommendations: result.recommendations,
          completionPrediction: result.completionPrediction,
          deviations: result.deviations,
          notes: result.dashboard.notes,
        },
        isPreview: false,
        watermark: null,
      };
    }

    // Pilot preview: limited real data + locked premium cards + labeled demo blend.
    return {
      payload: {
        ...core,
        isPreview: true,
        watermark: PILOT_WATERMARK,
        historyWindowDays: PilotLimits.DASHBOARD_HISTORY_DAYS,
        // Show only the top risk; deeper analytics are locked.
        risks: result.risks.slice(0, 1),
        recommendations: result.recommendations.slice(0, 1),
        lockedCards: [
          lockedCard('Delay Prediction & Confidence Bands'),
          lockedCard('Full Risk Register'),
          lockedCard('Historical Comparisons'),
          lockedCard('Cost Impact Analysis'),
        ],
        demo: demoBlend(),
      },
      isPreview: true,
      watermark: PILOT_WATERMARK,
    };
  },

  /** Persist a dashboard snapshot (called within the evaluation transaction). */
  async persist(
    siteId: string,
    built: BuiltDashboard,
    db: DbClient,
  ): Promise<void> {
    await analyticsRepository.createDashboardSnapshot(
      { siteId, data: built.payload, isPreview: built.isPreview },
      db,
    );
  },

  /** Read the latest dashboard snapshot for a site (authorized). */
  async getLatest(user: AuthUser, siteId: string) {
    const { site } = await requireCapabilityOnSite(user.id, siteId, Capability.VIEW_DASHBOARD);
    const snapshot = await analyticsRepository.findLatestDashboard(siteId);
    if (!snapshot) {
      throw new NotFoundError('No dashboard available yet. Run an evaluation first.');
    }

    const subscription = await billingRepository.findSubscription(site.project.organizationId);
    const watermark =
      subscription && isPilotTier(subscription.tier) ? PILOT_WATERMARK : null;

    return {
      siteId,
      isPreview: snapshot.isPreview,
      watermark,
      generatedAt: snapshot.createdAt.toISOString(),
      data: snapshot.data,
    };
  },

  async siteExists(siteId: string): Promise<boolean> {
    return (await siteRepository.findByIdWithProject(siteId)) !== null;
  },
};
