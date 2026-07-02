/**
 * Parsed site-graph schema (AI output contract, stage 1: parsing).
 *
 * Responsibility: Define the Zod contract for the normalized digital
 * representation a `DrawingParser` produces from an engineering drawing. This is
 * the `parsedSite` portion of the overall AI output. Persisted as `ParsedDrawing.graph`.
 *
 * Design: measurements are optional and always paired with confidence; the model
 * is instructed never to fabricate dimensions. `observedFacts` (read from the
 * drawing) are kept separate from `assumptions` (inferred) per the blueprint.
 */
import { z } from 'zod';

const confidence = z.number().min(0).max(1);

export const zoneSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  /** e.g. floor, wall, road, utility-zone, construction-zone, section. */
  type: z.string().min(1),
  areaSqm: z.number().nonnegative().nullable().default(null),
  dimensions: z
    .object({
      width: z.number().nonnegative(),
      height: z.number().nonnegative(),
      unit: z.string().min(1),
    })
    .nullable()
    .default(null),
  confidence,
});

export const edgeSchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
  /** e.g. adjacent, depends-on, connects, blocks. */
  relation: z.string().min(1),
});

export const utilitySchema = z.object({
  id: z.string().min(1),
  type: z.string().min(1),
  description: z.string().nullable().default(null),
  confidence,
});

export const siteGraphSchema = z.object({
  dimensions: z
    .object({
      unit: z.string().min(1),
      siteWidth: z.number().nonnegative().nullable().default(null),
      siteHeight: z.number().nonnegative().nullable().default(null),
    })
    .nullable()
    .default(null),
  zones: z.array(zoneSchema),
  edges: z.array(edgeSchema),
  utilities: z.array(utilitySchema),
  observedFacts: z.array(z.string()),
  assumptions: z.array(z.string()),
  overallConfidence: confidence,
});

export type SiteGraph = z.infer<typeof siteGraphSchema>;
