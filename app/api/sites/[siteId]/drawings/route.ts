/**
 * /api/sites/[siteId]/drawings
 *  GET  — list drawings for a site.
 *  POST — upload a drawing (multipart/form-data, field "file").
 *
 * POC policy: ANY file type is accepted (loose validation); size is bounded and
 * the stored object key is server-derived. The parsing strategy is selected later
 * by the DrawingParser factory.
 */
import { withAuthedRoute } from '@/lib/http/handler';
import { jsonOk } from '@/lib/http/response';
import { parseParams } from '@/lib/http/validate';
import { ValidationError } from '@/lib/errors';
import { drawingDto, drawingListDto } from '@/schemas/drawing';
import { drawingService } from '@/services/drawingService';
import { z } from 'zod';

const paramsSchema = z.object({ siteId: z.string().min(1) });

type Params = { siteId: string };

export const GET = withAuthedRoute<Params>(async (_req, ctx, segment) => {
  const { siteId } = parseParams(await segment.params, paramsSchema);
  const drawings = await drawingService.listBySite(ctx.user, siteId);
  return jsonOk(drawingListDto, drawings, { correlationId: ctx.correlationId });
});

export const POST = withAuthedRoute<Params>(async (req, ctx, segment) => {
  const { siteId } = parseParams(await segment.params, paramsSchema);

  const form = await req.formData();
  const file = form.get('file');
  if (!(file instanceof File)) {
    throw new ValidationError('A file must be provided in the "file" form field');
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const drawing = await drawingService.upload(ctx.user, siteId, {
    fileName: file.name || 'upload',
    mimeType: file.type || 'application/octet-stream',
    bytes,
  });

  return jsonOk(drawingDto, drawing, { correlationId: ctx.correlationId, status: 201 });
});
