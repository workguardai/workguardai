/**
 * Schema tests: the AI output contracts accept valid payloads and reject invalid
 * ones (out-of-range confidence/percent, wrong enum values).
 */
import { describe, it, expect } from 'vitest';

import { siteGraphSchema } from '@/lib/ai/schemas/siteGraph';
import { evaluationResultSchema } from '@/lib/ai/schemas/evaluation';
import { validSiteGraph, validEvaluationResult } from '@/tests/fixtures';

describe('siteGraphSchema', () => {
  it('accepts a valid site graph', () => {
    expect(() => siteGraphSchema.parse(validSiteGraph)).not.toThrow();
  });

  it('rejects confidence outside 0..1', () => {
    const bad = { ...validSiteGraph, overallConfidence: 1.5 };
    expect(siteGraphSchema.safeParse(bad).success).toBe(false);
  });

  it('applies null defaults for optional measurements', () => {
    const parsed = siteGraphSchema.parse({
      dimensions: null,
      zones: [{ id: 'z', name: 'n', type: 't', confidence: 0.5 }],
      edges: [],
      utilities: [],
      observedFacts: [],
      assumptions: [],
      overallConfidence: 0.5,
    });
    expect(parsed.zones[0]?.areaSqm).toBeNull();
    expect(parsed.zones[0]?.dimensions).toBeNull();
  });
});

describe('evaluationResultSchema', () => {
  it('accepts a valid evaluation result', () => {
    expect(() => evaluationResultSchema.parse(validEvaluationResult)).not.toThrow();
  });

  it('rejects an unknown milestone status', () => {
    const bad = {
      ...validEvaluationResult,
      milestones: [{ ...validEvaluationResult.milestones[0], status: 'NOPE' }],
    };
    expect(evaluationResultSchema.safeParse(bad).success).toBe(false);
  });

  it('rejects percent above 100', () => {
    const bad = {
      ...validEvaluationResult,
      currentProgress: { ...validEvaluationResult.currentProgress, expectedPct: 120 },
    };
    expect(evaluationResultSchema.safeParse(bad).success).toBe(false);
  });
});
