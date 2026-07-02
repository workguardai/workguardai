/**
 * DrawingParser factory.
 *
 * Responsibility: The SINGLE place that maps `env.DRAWING_PARSER_STRATEGY` to a
 * concrete `DrawingParser`. Swapping the active strategy is a one-line env
 * change; no upload/service/API code references a concrete parser.
 *
 * Extension point: register new strategies here. `llm` is injected so callers
 * (and tests) control the LLM instance.
 */
import { env } from '@/lib/env';
import { getLLM, type GeminiLLM } from '@/lib/ai/LLM';
import { ParserStrategy, type DrawingParser } from '@/lib/ai/parsers/DrawingParser';
import { GeminiDirectParser } from '@/lib/ai/parsers/GeminiDirectParser';
import { DxfGeometryParser } from '@/lib/ai/parsers/DxfGeometryParser';

/** Build the parser selected by configuration (or an explicit override). */
export function getDrawingParser(
  strategy: ParserStrategy = env.DRAWING_PARSER_STRATEGY,
  llm: GeminiLLM = getLLM(),
): DrawingParser {
  switch (strategy) {
    case ParserStrategy.GEMINI_DIRECT:
      return new GeminiDirectParser(llm);
    case ParserStrategy.DXF_GEOMETRY:
      return new DxfGeometryParser(llm);
    default: {
      // Exhaustiveness guard: a new strategy must be handled above.
      const _never: never = strategy;
      throw new Error(`Unsupported drawing parser strategy: ${String(_never)}`);
    }
  }
}
