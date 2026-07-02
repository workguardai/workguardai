/**
 * Common Zod schemas shared across the API surface.
 *
 * Responsibility: Define the response envelope and reusable primitives
 * (pagination, id params) so every endpoint validates its output against a
 * single contract. Per CLAUDE.md, no endpoint may return an unvalidated object.
 */
import { z } from 'zod';

import { ErrorCode } from '@/lib/errors';
import { Pagination } from '@/lib/constants';

/** Envelope for a successful response. `data` shape is supplied per endpoint. */
export const successEnvelope = <T extends z.ZodTypeAny>(data: T) =>
  z.object({
    ok: z.literal(true),
    data,
    meta: z
      .object({
        correlationId: z.string(),
        page: z.number().int().positive().optional(),
        pageSize: z.number().int().positive().optional(),
        total: z.number().int().nonnegative().optional(),
      })
      .optional(),
  });

/** Envelope for a failed response. Never contains stack traces. */
export const errorEnvelope = z.object({
  ok: z.literal(false),
  error: z.object({
    code: z.enum(Object.values(ErrorCode) as [ErrorCode, ...ErrorCode[]]),
    message: z.string(),
    details: z.unknown().optional(),
  }),
  meta: z
    .object({
      correlationId: z.string(),
    })
    .optional(),
});

export type ErrorEnvelope = z.infer<typeof errorEnvelope>;

/** Standard `cuid`-style id path param. */
export const idParam = z.object({
  id: z.string().min(1),
});

/** Query params for paginated list endpoints. */
export const paginationQuery = z.object({
  page: z.coerce.number().int().positive().default(Pagination.DEFAULT_PAGE),
  pageSize: z.coerce
    .number()
    .int()
    .positive()
    .max(Pagination.MAX_PAGE_SIZE)
    .default(Pagination.DEFAULT_PAGE_SIZE),
});

export type PaginationQuery = z.infer<typeof paginationQuery>;
