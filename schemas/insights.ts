/**
 * Insights API schemas (dashboard, alerts, notifications, subscription).
 *
 * Responsibility: Response DTOs for read-side endpoints. The dashboard payload
 * is intentionally loose (`z.unknown()` inside a typed envelope) because its
 * inner shape is produced by the AI dashboard generator and may evolve; the
 * envelope fields (preview flag, timestamps, watermark) are strict.
 */
import { z } from 'zod';
import { AlertCategory, AlertSeverity, NotificationStatus, SubscriptionTier } from '@prisma/client';

// --- Dashboard ---
export const dashboardResponse = z.object({
  siteId: z.string(),
  isPreview: z.boolean(),
  /** Present on pilot/preview payloads; labels blended demo/watermarked content. */
  watermark: z.string().nullable(),
  generatedAt: z.string(),
  data: z.unknown(),
});

// --- Alerts ---
export const alertDto = z.object({
  id: z.string(),
  siteId: z.string(),
  category: z.enum(AlertCategory),
  severity: z.enum(AlertSeverity),
  title: z.string(),
  reason: z.string(),
  recommendation: z.string().nullable(),
  confidence: z.number().nullable(),
  resolvedAt: z.string().nullable(),
  createdAt: z.string(),
});
export const alertListDto = z.array(alertDto);

// --- Notifications ---
export const notificationDto = z.object({
  id: z.string(),
  title: z.string(),
  body: z.string(),
  status: z.enum(NotificationStatus),
  alertId: z.string().nullable(),
  createdAt: z.string(),
});
export const notificationListDto = z.array(notificationDto);

// --- Subscription / usage ---
export const subscriptionResponse = z.object({
  organizationId: z.string(),
  tier: z.enum(SubscriptionTier),
  status: z.string(),
  usage: z.object({
    projectCount: z.number().int(),
    siteCount: z.number().int(),
    drawingCount: z.number().int(),
    aiEvaluationCount: z.number().int(),
    alertCount: z.number().int(),
  }),
  limits: z.object({
    maxProjects: z.number().int(),
    maxSites: z.number().int(),
    maxDrawings: z.number().int(),
    maxAiEvaluations: z.number().int(),
    maxAlerts: z.number().int(),
  }),
});
