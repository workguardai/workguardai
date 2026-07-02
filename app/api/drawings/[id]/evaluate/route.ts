/**
 * POST /api/drawings/[id]/evaluate — run the AI evaluation pipeline for a
 * drawing (parse -> evaluate -> persist milestones/progress/deviations/alerts/
 * dashboard/notifications). Returns a summary; full detail is read via the
 * dashboard and alerts endpoints.
 */
import { z } from 'zod';

import { withAuthedRoute } from '@/lib/http/handler';
import { jsonOk } from '@/lib/http/response';
import { parseParams } from '@/lib/http/validate';
import { evaluationSummaryDto } from '@/schemas/drawing';
import { evaluationService } from '@/services/evaluationService';

const paramsSchema = z.object({ id: z.string().min(1) });

type Params = { id: string };

export const POST = withAuthedRoute<Params>(async (_req, ctx, segment) => {
  const { id } = parseParams(await segment.params, paramsSchema);
  const summary = await evaluationService.evaluate(ctx.user, id);
  return jsonOk(evaluationSummaryDto, summary, { correlationId: ctx.correlationId, status: 201 });
});
