/**
 * DrawingParser abstraction.
 *
 * Responsibility: Define the contract every drawing-parsing strategy implements,
 * so the rest of the system (upload, services, API) depends only on this
 * interface. Swapping strategies must touch ONLY the factory.
 *
 * Contract: given the raw uploaded file bytes, produce a validated normalized
 * site graph plus a confidence score and optional usage/cost telemetry.
 */
import type { Logger } from '@/lib/logger';
import type { SiteGraph } from '@/lib/ai/schemas/siteGraph';
import type { TokenUsage } from '@/lib/ai/LLM';

/** Strategy identifiers, aligned with `env.DRAWING_PARSER_STRATEGY`. */
export const ParserStrategy = {
  GEMINI_DIRECT: 'gemini_direct',
  DXF_GEOMETRY: 'dxf_geometry',
} as const;

export type ParserStrategy = (typeof ParserStrategy)[keyof typeof ParserStrategy];

export interface ParseInput {
  fileName: string;
  mimeType: string;
  bytes: Uint8Array;
}

export interface ParseOutput {
  strategy: ParserStrategy;
  graph: SiteGraph;
  confidence: number;
  usage: TokenUsage | null;
  costUsd: number | null;
}

export interface DrawingParser {
  readonly strategy: ParserStrategy;
  parse(input: ParseInput, log: Logger): Promise<ParseOutput>;
}
