/**
 * Evaluation-result schema (AI output contract, stage 2: reasoning).
 *
 * Responsibility: Define the Zod contract for the full construction analysis the
 * AI produces from a parsed site graph — milestones, planned-vs-actual progress,
 * deviations, alerts, completion prediction, risks, recommendations and a
 * dashboard payload. Enum fields reuse the Prisma enums so DB persistence needs
 * no remapping. Dates are ISO-8601 strings (nullable) at the AI boundary and are
 * converted to `Date` in the service layer.
 *
 * This is the authoritative "Gemini must return JSON matching this" contract.
 */
import { z } from 'zod';
import {
  AlertCategory,
  AlertSeverity,
  DeviationType,
  MilestoneStatus,
} from '@prisma/client';

const confidence = z.number().min(0).max(1);
const percent = z.number().min(0).max(100);
const isoDate = z.string().datetime().nullable().default(null);

export const evaluationMilestoneSchema = z.object({
  key: z.string().min(1),
  title: z.string().min(1),
  description: z.string().nullable().default(null),
  status: z.enum(MilestoneStatus),
  expectedPct: percent,
  actualPct: percent,
  confidence,
  dueDate: isoDate,
});

export const evaluationDeviationSchema = z.object({
  milestoneKey: z.string().min(1).nullable().default(null),
  type: z.enum(DeviationType),
  description: z.string().min(1),
  severity: z.enum(AlertSeverity),
  confidence,
});

export const evaluationAlertSchema = z.object({
  category: z.enum(AlertCategory),
  severity: z.enum(AlertSeverity),
  title: z.string().min(1),
  reason: z.string().min(1),
  recommendation: z.string().nullable().default(null),
  confidence,
});

export const evaluationRiskSchema = z.object({
  area: z.string().min(1),
  severity: z.enum(AlertSeverity),
  description: z.string().min(1),
  confidence,
});

export const dashboardKpiSchema = z.object({
  label: z.string().min(1),
  value: z.union([z.string(), z.number()]),
  unit: z.string().nullable().default(null),
});

export const evaluationResultSchema = z.object({
  project: z.object({
    summary: z.string().min(1),
    disciplineNotes: z.string().nullable().default(null),
  }),
  milestones: z.array(evaluationMilestoneSchema),
  currentProgress: z.object({
    expectedPct: percent,
    actualPct: percent,
    riskScore: confidence,
    confidence,
    predictedCompletion: isoDate,
  }),
  deviations: z.array(evaluationDeviationSchema),
  alerts: z.array(evaluationAlertSchema),
  completionPrediction: z.object({
    predictedEndDate: isoDate,
    confidence,
    rationale: z.string().min(1),
  }),
  risks: z.array(evaluationRiskSchema),
  recommendations: z.array(z.string()),
  dashboard: z.object({
    headline: z.string().min(1),
    summary: z.string().min(1),
    kpis: z.array(dashboardKpiSchema),
    notes: z.string().nullable().default(null),
  }),
});

export type EvaluationResult = z.infer<typeof evaluationResultSchema>;
export type EvaluationMilestone = z.infer<typeof evaluationMilestoneSchema>;
export type EvaluationAlert = z.infer<typeof evaluationAlertSchema>;
