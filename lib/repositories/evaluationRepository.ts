/**
 * AI evaluation repository.
 *
 * Responsibility: Track the lifecycle of an AI run over a drawing version
 * (`AIEvaluation`) and persist the normalized site graph (`ParsedDrawing`).
 * Token/cost fields are recorded for observability and billing hooks.
 */
import type { AIEvaluation, ParsedDrawing, Prisma } from '@prisma/client';
import { AIEvaluationStatus } from '@prisma/client';

import { defaultDb, type DbClient } from '@/lib/repositories/types';

export const evaluationRepository = {
  async create(
    input: { siteId: string; drawingVersionId: string; model: string },
    db: DbClient = defaultDb,
  ): Promise<AIEvaluation> {
    return db.aIEvaluation.create({
      data: {
        siteId: input.siteId,
        drawingVersionId: input.drawingVersionId,
        model: input.model,
        status: AIEvaluationStatus.RUNNING,
      },
    });
  },

  async markSucceeded(
    id: string,
    input: {
      output: Prisma.InputJsonValue;
      promptTokens: number | null;
      completionTokens: number | null;
      costUsd: number | null;
    },
    db: DbClient = defaultDb,
  ): Promise<AIEvaluation> {
    return db.aIEvaluation.update({
      where: { id },
      data: {
        status: AIEvaluationStatus.SUCCEEDED,
        output: input.output,
        promptTokens: input.promptTokens,
        completionTokens: input.completionTokens,
        costUsd: input.costUsd,
      },
    });
  },

  async markFailed(id: string, error: string, db: DbClient = defaultDb): Promise<AIEvaluation> {
    return db.aIEvaluation.update({
      where: { id },
      data: { status: AIEvaluationStatus.FAILED, error },
    });
  },

  /** Store (or replace) the parsed site graph for a drawing version. */
  async upsertParsedDrawing(
    input: {
      drawingVersionId: string;
      parserStrategy: string;
      graph: Prisma.InputJsonValue;
      confidence: number | null;
    },
    db: DbClient = defaultDb,
  ): Promise<ParsedDrawing> {
    return db.parsedDrawing.upsert({
      where: { drawingVersionId: input.drawingVersionId },
      create: input,
      update: {
        parserStrategy: input.parserStrategy,
        graph: input.graph,
        confidence: input.confidence,
      },
    });
  },
};
