/**
 * ROI model (pure, testable). Estimates annual delay loss and the saving from
 * WorkGuard AI. Delay cost is a conservative 8% of at-risk project value, cut
 * 60% by real-time monitoring, net of the €550/mo Pro plan.
 */
export const ROI = {
  DELAY_COST_RATE: 0.08,
  REDUCTION: 0.6,
  PRO_ANNUAL: 550 * 12,
  HOURS_PER_SITE: 240,
} as const;

export interface RoiInput {
  sites: number;
  value: number;
  delayRate: number; // percent, 0-100
}

export interface RoiResult {
  annualLoss: number;
  saving: number;
  hours: number;
}

export function computeRoi({ sites, value, delayRate }: RoiInput): RoiResult {
  const atRiskValue = sites * value * (delayRate / 100);
  const annualLoss = atRiskValue * ROI.DELAY_COST_RATE;
  const saving = Math.max(0, annualLoss * ROI.REDUCTION - ROI.PRO_ANNUAL);
  const hours = sites * ROI.HOURS_PER_SITE;
  return { annualLoss, saving, hours };
}
