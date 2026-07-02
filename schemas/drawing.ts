/**
 * Drawing & evaluation API schemas.
 *
 * Responsibility: Response DTOs for drawings and the evaluation result summary.
 * Upload is multipart/form-data (validated in the pipeline, not via a JSON body).
 */
import { z } from 'zod';
import { ProcessingStatus } from '@prisma/client';

export const drawingDto = z.object({
  id: z.string(),
  siteId: z.string(),
  originalName: z.string(),
  mimeType: z.string().nullable(),
  fileSize: z.number().int().nullable(),
  status: z.enum(ProcessingStatus),
  latestVersion: z.number().int(),
  createdAt: z.string(),
});
export const drawingListDto = z.array(drawingDto);

/** Summary returned after running an evaluation (full detail lives in dashboard/alerts). */
export const evaluationSummaryDto = z.object({
  evaluationId: z.string(),
  drawingId: z.string(),
  status: z.string(),
  milestonesCreated: z.number().int(),
  deviationsCreated: z.number().int(),
  alertsCreated: z.number().int(),
  expectedPct: z.number(),
  actualPct: z.number(),
  costUsd: z.number().nullable(),
});
