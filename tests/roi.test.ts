import { describe, it, expect } from 'vitest';

import { computeRoi, ROI } from '@/lib/roi';

describe('computeRoi', () => {
  it('computes annual loss from the default inputs', () => {
    const { annualLoss } = computeRoi({ sites: 5, value: 1_000_000, delayRate: 40 });
    // 5 * 1,000,000 * 0.40 * 0.08 = 160,000
    expect(annualLoss).toBe(160_000);
  });

  it('nets the Pro plan cost out of the saving', () => {
    const { annualLoss, saving } = computeRoi({ sites: 5, value: 1_000_000, delayRate: 40 });
    expect(saving).toBe(annualLoss * ROI.REDUCTION - ROI.PRO_ANNUAL);
  });

  it('never returns a negative saving', () => {
    const { saving } = computeRoi({ sites: 1, value: 100_000, delayRate: 0 });
    expect(saving).toBe(0);
  });

  it('scales monitoring hours by site count', () => {
    expect(computeRoi({ sites: 3, value: 1, delayRate: 10 }).hours).toBe(3 * ROI.HOURS_PER_SITE);
  });
});
