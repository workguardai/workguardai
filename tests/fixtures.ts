/**
 * Shared test fixtures: valid AI payloads matching the Zod contracts.
 */
import type { SiteGraph } from '@/lib/ai/schemas/siteGraph';
import type { EvaluationResult } from '@/lib/ai/schemas/evaluation';

export const validSiteGraph: SiteGraph = {
  dimensions: { unit: 'm', siteWidth: 100, siteHeight: 50 },
  zones: [
    {
      id: 'z1',
      name: 'Foundation',
      type: 'construction-zone',
      areaSqm: 200,
      dimensions: { width: 20, height: 10, unit: 'm' },
      confidence: 0.8,
    },
  ],
  edges: [{ from: 'z1', to: 'z2', relation: 'depends-on' }],
  utilities: [{ id: 'u1', type: 'water', description: null, confidence: 0.7 }],
  observedFacts: ['grid lines present'],
  assumptions: ['scale assumed 1:100'],
  overallConfidence: 0.75,
};

export const validEvaluationResult: EvaluationResult = {
  project: { summary: 'Foundation phase in progress', disciplineNotes: null },
  milestones: [
    {
      key: 'foundation',
      title: 'Foundation complete',
      description: null,
      status: 'IN_PROGRESS',
      expectedPct: 40,
      actualPct: 30,
      confidence: 0.7,
      dueDate: null,
    },
  ],
  currentProgress: {
    expectedPct: 40,
    actualPct: 30,
    riskScore: 0.35,
    confidence: 0.7,
    predictedCompletion: null,
  },
  deviations: [
    {
      milestoneKey: 'foundation',
      type: 'MISSING_WORK',
      description: 'Rebar not yet placed in zone z1',
      severity: 'MEDIUM',
      confidence: 0.6,
    },
  ],
  alerts: [
    {
      category: 'DELAY_PREDICTED',
      severity: 'HIGH',
      title: 'Foundation slipping',
      reason: 'Actual progress trails expected by 10%',
      recommendation: 'Add a second crew',
      confidence: 0.65,
    },
  ],
  completionPrediction: {
    predictedEndDate: null,
    confidence: 0.6,
    rationale: 'Insufficient historical data; conservative estimate',
  },
  risks: [
    { area: 'Foundation', severity: 'MEDIUM', description: 'Weather exposure', confidence: 0.5 },
  ],
  recommendations: ['Sequence utilities after foundation'],
  dashboard: {
    headline: 'Foundation 30% complete',
    summary: 'Slightly behind schedule',
    kpis: [{ label: 'Progress', value: 30, unit: '%' }],
    notes: null,
  },
};
