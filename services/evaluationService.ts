/**
 * Evaluation service (AI pipeline orchestrator).
 *
 * Responsibility: Run the end-to-end AI evaluation for a drawing:
 *   authorize -> enforce limits -> download file -> parse (strategy via factory)
 *   -> evaluate -> persist everything atomically (parsed graph, milestones,
 *   deviations, progress snapshot, alerts, dashboard, notifications, AI run,
 *   usage counters, audit) -> return a summary.
 *
 * Long-running AI calls happen OUTSIDE the DB transaction; only the writes are
 * transactional. Failures mark the AIEvaluation and drawing as FAILED.
 *
 * Extension point: parsing strategy is chosen by the factory (env-driven); this
 * orchestrator is parser-agnostic. Background/queue execution can wrap `evaluate`
 * without changing its internals (see the "background processing abstraction").
 */
import { ProcessingStatus, type Prisma } from '@prisma/client';

import { prisma } from '@/lib/prisma';
import { NotFoundError } from '@/lib/errors';
import { AuditAction } from '@/lib/constants';
import { logger } from '@/lib/logger';
import { Capability } from '@/lib/auth/rbac';
import { requireCapabilityOnSite } from '@/lib/auth/authorization';
import { getStorage } from '@/lib/storage';
import { getLLM } from '@/lib/ai/LLM';
import { getDrawingParser } from '@/lib/ai/parsers/factory';
import { SiteEvaluator } from '@/lib/ai/evaluators/siteEvaluator';
import { drawingRepository } from '@/lib/repositories/drawingRepository';
import { evaluationRepository } from '@/lib/repositories/evaluationRepository';
import { analyticsRepository } from '@/lib/repositories/analyticsRepository';
import { billingRepository } from '@/lib/repositories/billingRepository';
import { notificationRepository } from '@/lib/repositories/notificationRepository';
import { auditRepository } from '@/lib/repositories/auditRepository';
import { usageService } from '@/services/usageService';
import { dashboardService } from '@/services/dashboardService';
import { GeminiDefaults } from '@/lib/constants';
import type {
  AlertInput,
  DeviationInput,
  MilestoneInput,
} from '@/lib/repositories/analyticsRepository';
import type { EvaluationResult } from '@/lib/ai/schemas/evaluation';
import type { AuthUser } from '@/types';

/** Alert severities that also generate a user notification. */
const NOTIFY_SEVERITIES = new Set(['HIGH', 'CRITICAL']);

function parseDate(iso: string | null): Date | null {
  return iso ? new Date(iso) : null;
}

function toMilestoneInputs(result: EvaluationResult): MilestoneInput[] {
  return result.milestones.map((m) => ({
    key: m.key,
    title: m.title,
    description: m.description,
    status: m.status,
    expectedPct: m.expectedPct,
    actualPct: m.actualPct,
    confidence: m.confidence,
    dueDate: parseDate(m.dueDate),
  }));
}

function toDeviationInputs(result: EvaluationResult): DeviationInput[] {
  return result.deviations.map((d) => ({
    milestoneKey: d.milestoneKey,
    type: d.type,
    description: d.description,
    severity: d.severity,
    confidence: d.confidence,
    details: null,
  }));
}

function toAlertInputs(result: EvaluationResult): AlertInput[] {
  return result.alerts.map((a) => ({
    category: a.category,
    severity: a.severity,
    title: a.title,
    reason: a.reason,
    recommendation: a.recommendation,
    confidence: a.confidence,
    metadata: null,
  }));
}

export const evaluationService = {
  async evaluate(user: AuthUser, drawingId: string) {
    const drawing = await drawingRepository.findById(drawingId);
    if (!drawing) {
      throw new NotFoundError('Drawing not found');
    }

    const { site } = await requireCapabilityOnSite(
      user.id,
      drawing.siteId,
      Capability.RUN_EVALUATION,
    );
    const organizationId = site.project.organizationId;

    await usageService.assertCanEvaluate(organizationId);

    const version = await drawingRepository.findLatestVersion(drawing.id);
    if (!version) {
      throw new NotFoundError('Drawing has no version to evaluate');
    }

    const log = logger.child({
      component: 'evaluationService',
      drawingId,
      siteId: drawing.siteId,
    });

    const evaluation = await evaluationRepository.create({
      siteId: drawing.siteId,
      drawingVersionId: version.id,
      model: GeminiDefaults.MODEL,
    });
    await drawingRepository.setStatus(drawing.id, ProcessingStatus.PROCESSING);

    try {
      // --- AI work (outside the transaction) ---
      const bytes = await getStorage().download(drawing.storageKey);

      const llm = getLLM();
      const parser = getDrawingParser(undefined, llm);
      const parsed = await parser.parse(
        {
          fileName: drawing.originalName,
          mimeType: drawing.mimeType ?? 'application/octet-stream',
          bytes,
        },
        log,
      );

      const evaluator = new SiteEvaluator(llm);
      const { result, usage, costUsd } = await evaluator.evaluate(
        parsed.graph,
        {
          projectName: site.project.name,
          siteName: site.name,
          siteLocation: site.location,
        },
        log,
      );

      // Cap alerts to the org's remaining allowance (pilot gating).
      const remainingAlerts = await usageService.remainingAlertCapacity(organizationId);
      const allAlertInputs = toAlertInputs(result);
      const alertInputs = Number.isFinite(remainingAlerts)
        ? allAlertInputs.slice(0, remainingAlerts)
        : allAlertInputs;

      const subscription = await billingRepository.findSubscription(organizationId);
      const tier = subscription?.tier ?? undefined;
      const dashboard = dashboardService.buildPayload(
        // Default to the most-restricted view if somehow no subscription exists.
        tier ?? 'PILOT',
        result,
        { siteName: site.name },
      );

      // --- Persist atomically ---
      const summary = await prisma.$transaction(async (tx) => {
        await evaluationRepository.upsertParsedDrawing(
          {
            drawingVersionId: version.id,
            parserStrategy: parsed.strategy,
            graph: parsed.graph as unknown as Prisma.InputJsonValue,
            confidence: parsed.confidence,
          },
          tx,
        );

        const milestoneIdByKey = await analyticsRepository.replaceMilestones(
          drawing.siteId,
          toMilestoneInputs(result),
          tx,
        );
        const deviationsCreated = await analyticsRepository.createDeviations(
          drawing.siteId,
          toDeviationInputs(result),
          milestoneIdByKey,
          tx,
        );
        await analyticsRepository.createProgressSnapshot(
          {
            siteId: drawing.siteId,
            expectedPct: result.currentProgress.expectedPct,
            actualPct: result.currentProgress.actualPct,
            riskScore: result.currentProgress.riskScore,
            confidence: result.currentProgress.confidence,
            predictedEnd:
              parseDate(result.currentProgress.predictedCompletion) ??
              parseDate(result.completionPrediction.predictedEndDate),
          },
          tx,
        );

        const createdAlerts = await analyticsRepository.createAlerts(
          drawing.siteId,
          alertInputs,
          tx,
        );

        await dashboardService.persist(drawing.siteId, dashboard, tx);

        // Notify the acting user of significant alerts.
        const notifications = createdAlerts
          .filter((a) => NOTIFY_SEVERITIES.has(a.severity))
          .map((a) => ({
            userId: user.id,
            alertId: a.id,
            title: a.title,
            body: a.reason,
          }));
        await notificationRepository.createMany(notifications, tx);

        await evaluationRepository.markSucceeded(
          evaluation.id,
          {
            output: result as unknown as Prisma.InputJsonValue,
            promptTokens: usage?.promptTokens ?? null,
            completionTokens: usage?.completionTokens ?? null,
            costUsd: costUsd ?? null,
          },
          tx,
        );

        await billingRepository.incrementUsage(organizationId, 'aiEvaluationCount', 1, tx);
        if (createdAlerts.length > 0) {
          await billingRepository.incrementUsage(
            organizationId,
            'alertCount',
            createdAlerts.length,
            tx,
          );
        }

        await drawingRepository.setStatus(drawing.id, ProcessingStatus.COMPLETED, tx);
        await drawingRepository.setVersionStatus(version.id, ProcessingStatus.COMPLETED, tx);

        await auditRepository.record(
          {
            organizationId,
            userId: user.id,
            action: AuditAction.DRAWING_EVALUATED,
            resourceType: 'Drawing',
            resourceId: drawing.id,
            metadata: { evaluationId: evaluation.id, alerts: createdAlerts.length },
          },
          tx,
        );

        return {
          evaluationId: evaluation.id,
          drawingId: drawing.id,
          status: 'SUCCEEDED',
          milestonesCreated: milestoneIdByKey.size,
          deviationsCreated,
          alertsCreated: createdAlerts.length,
          expectedPct: result.currentProgress.expectedPct,
          actualPct: result.currentProgress.actualPct,
          costUsd: costUsd ?? null,
        };
      });

      log.info('evaluation.completed', { evaluationId: evaluation.id });
      return summary;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      log.error('evaluation.failed', { evaluationId: evaluation.id, err: message });
      await evaluationRepository.markFailed(evaluation.id, message);
      await drawingRepository.setStatus(drawing.id, ProcessingStatus.FAILED);
      throw error;
    }
  },
};
