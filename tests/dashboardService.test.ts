/**
 * Tests for the dashboard payload builder (pure, tier-dependent shaping).
 * Pilot/Free -> watermarked preview with locked cards + labeled demo blend.
 * Pro/Enterprise -> full payload, no watermark.
 */
import { describe, it, expect } from 'vitest';
import { SubscriptionTier } from '@prisma/client';

import { dashboardService } from '@/services/dashboardService';
import { validEvaluationResult } from '@/tests/fixtures';

const ctx = { siteName: 'Site A' };

describe('dashboardService.buildPayload', () => {
  it('produces a watermarked preview for the Pilot tier', () => {
    const built = dashboardService.buildPayload(SubscriptionTier.PILOT, validEvaluationResult, ctx);
    expect(built.isPreview).toBe(true);
    expect(built.watermark).toBeTruthy();

    const payload = built.payload as Record<string, unknown>;
    expect(payload.isPreview).toBe(true);
    expect(Array.isArray(payload.lockedCards)).toBe(true);
    expect(payload.demo).toBeTruthy();
  });

  it('produces a full payload for the Pro tier', () => {
    const built = dashboardService.buildPayload(SubscriptionTier.PRO, validEvaluationResult, ctx);
    expect(built.isPreview).toBe(false);
    expect(built.watermark).toBeNull();

    const payload = built.payload as Record<string, unknown>;
    expect(payload.isPreview).toBe(false);
    expect(payload.lockedCards).toBeUndefined();
    expect(payload.recommendations).toEqual(validEvaluationResult.recommendations);
  });

  it('limits pilot risks/recommendations to a teaser', () => {
    const built = dashboardService.buildPayload(SubscriptionTier.FREE, validEvaluationResult, ctx);
    const payload = built.payload as Record<string, unknown>;
    expect((payload.risks as unknown[]).length).toBeLessThanOrEqual(1);
    expect((payload.recommendations as unknown[]).length).toBeLessThanOrEqual(1);
  });
});
