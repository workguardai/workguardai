/**
 * Site analytics repository.
 *
 * Responsibility: Persist and read the structured outputs of an AI evaluation:
 * milestones and deviations (current-state, replaced per evaluation), progress
 * snapshots and dashboard snapshots (time series, appended), and alerts
 * (append-only events). Designed to run inside the evaluation `$transaction`.
 */
import { Prisma } from '@prisma/client';
import type {
  Alert,
  AlertCategory,
  AlertSeverity,
  DashboardSnapshot,
  DeviationType,
  Milestone,
  MilestoneStatus,
  ProgressSnapshot,
} from '@prisma/client';

import { defaultDb, type DbClient } from '@/lib/repositories/types';

export interface MilestoneInput {
  key: string;
  title: string;
  description: string | null;
  status: MilestoneStatus;
  expectedPct: number;
  actualPct: number;
  confidence: number | null;
  dueDate: Date | null;
}

export interface DeviationInput {
  milestoneKey: string | null;
  type: DeviationType;
  description: string;
  severity: AlertSeverity;
  confidence: number | null;
  details: Prisma.InputJsonValue | null;
}

export interface AlertInput {
  category: AlertCategory;
  severity: AlertSeverity;
  title: string;
  reason: string;
  recommendation: string | null;
  confidence: number | null;
  metadata: Prisma.InputJsonValue | null;
}

export const analyticsRepository = {
  /** Replace all milestones for a site; returns a key -> id map for linking. */
  async replaceMilestones(
    siteId: string,
    milestones: MilestoneInput[],
    db: DbClient = defaultDb,
  ): Promise<Map<string, string>> {
    await db.deviation.deleteMany({ where: { siteId } });
    await db.milestone.deleteMany({ where: { siteId } });

    const created: Milestone[] = [];
    for (const m of milestones) {
      created.push(await db.milestone.create({ data: { siteId, ...m } }));
    }
    return new Map(created.map((m) => [m.key, m.id]));
  },

  async createDeviations(
    siteId: string,
    deviations: DeviationInput[],
    milestoneIdByKey: Map<string, string>,
    db: DbClient = defaultDb,
  ): Promise<number> {
    if (deviations.length === 0) return 0;
    const result = await db.deviation.createMany({
      data: deviations.map((d) => ({
        siteId,
        milestoneId: d.milestoneKey ? (milestoneIdByKey.get(d.milestoneKey) ?? null) : null,
        type: d.type,
        description: d.description,
        severity: d.severity,
        confidence: d.confidence,
        details: d.details ?? Prisma.JsonNull,
      })),
    });
    return result.count;
  },

  async createProgressSnapshot(
    input: {
      siteId: string;
      expectedPct: number;
      actualPct: number;
      riskScore: number | null;
      confidence: number | null;
      predictedEnd: Date | null;
    },
    db: DbClient = defaultDb,
  ): Promise<ProgressSnapshot> {
    return db.progressSnapshot.create({ data: input });
  },

  async createAlerts(
    siteId: string,
    alerts: AlertInput[],
    db: DbClient = defaultDb,
  ): Promise<Alert[]> {
    const created: Alert[] = [];
    for (const a of alerts) {
      created.push(
        await db.alert.create({
          data: {
            siteId,
            category: a.category,
            severity: a.severity,
            title: a.title,
            reason: a.reason,
            recommendation: a.recommendation,
            confidence: a.confidence,
            metadata: a.metadata ?? Prisma.JsonNull,
          },
        }),
      );
    }
    return created;
  },

  async createDashboardSnapshot(
    input: { siteId: string; data: Prisma.InputJsonValue; isPreview: boolean },
    db: DbClient = defaultDb,
  ): Promise<DashboardSnapshot> {
    return db.dashboardSnapshot.create({ data: input });
  },

  async findLatestDashboard(
    siteId: string,
    db: DbClient = defaultDb,
  ): Promise<DashboardSnapshot | null> {
    return db.dashboardSnapshot.findFirst({
      where: { siteId },
      orderBy: { createdAt: 'desc' },
    });
  },

  async listAlerts(
    siteId: string,
    pagination: { skip: number; take: number },
    db: DbClient = defaultDb,
  ): Promise<{ items: Alert[]; total: number }> {
    const [items, total] = await Promise.all([
      db.alert.findMany({
        where: { siteId },
        orderBy: { createdAt: 'desc' },
        skip: pagination.skip,
        take: pagination.take,
      }),
      db.alert.count({ where: { siteId } }),
    ]);
    return { items, total };
  },
};
