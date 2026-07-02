/**
 * Site evaluator (AI pipeline stage 2: reasoning).
 *
 * Responsibility: Given a normalized site graph, produce the full construction
 * analysis (milestones, planned-vs-actual progress, deviations, alerts,
 * completion prediction, risks, recommendations, dashboard) as validated JSON.
 *
 * Inputs:  a `SiteGraph` plus light project/site context.
 * Outputs: `{ result, usage, costUsd }` with `result` validated against
 *          `evaluationResultSchema`.
 */
import { evaluationResultSchema, type EvaluationResult } from '@/lib/ai/schemas/evaluation';
import { EVALUATOR_SYSTEM_PROMPT } from '@/lib/ai/prompts/systemPrompt';
import type { SiteGraph } from '@/lib/ai/schemas/siteGraph';
import type { GeminiLLM, PromptPart, TokenUsage } from '@/lib/ai/LLM';
import type { Logger } from '@/lib/logger';

export interface EvaluationContext {
  projectName: string;
  siteName: string;
  siteLocation: string | null;
}

export interface SiteEvaluationOutput {
  result: EvaluationResult;
  usage: TokenUsage | null;
  costUsd: number | null;
}

export class SiteEvaluator {
  private readonly llm: GeminiLLM;

  constructor(llm: GeminiLLM) {
    this.llm = llm;
  }

  async evaluate(
    graph: SiteGraph,
    context: EvaluationContext,
    log: Logger,
  ): Promise<SiteEvaluationOutput> {
    log.info('evaluator.start', {
      zones: graph.zones.length,
      edges: graph.edges.length,
    });

    const parts: PromptPart[] = [
      {
        text:
          `Project: ${context.projectName}\n` +
          `Site: ${context.siteName}${context.siteLocation ? ` (${context.siteLocation})` : ''}\n\n` +
          `Normalized site graph (JSON):\n${JSON.stringify(graph)}\n\n` +
          `Produce the full construction analysis as JSON conforming to the required schema.`,
      },
    ];

    const { data, usage, costUsd } = await this.llm.generateStructured({
      systemPrompt: EVALUATOR_SYSTEM_PROMPT,
      parts,
      schema: evaluationResultSchema,
      label: 'evaluate.site',
    });

    return { result: data, usage, costUsd };
  }
}
