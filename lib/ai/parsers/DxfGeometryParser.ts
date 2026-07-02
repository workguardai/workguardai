/**
 * DxfGeometryParser (ready but stubbed strategy: `dxf_geometry`).
 *
 * Responsibility: The recommended production pipeline —
 *   DWG -> DXF -> deterministic geometry extraction -> Gemini reasoning over the
 *   extracted primitives (rather than the raw file). This yields precise,
 *   non-hallucinated measurements before any LLM step.
 *
 * Status: intentionally STUBBED for the POC. The class is wired so switching
 * `DRAWING_PARSER_STRATEGY=dxf_geometry` selects it via the factory with no other
 * code change. Implementing `parse` is the single remaining step: (1) convert
 * DWG->DXF, (2) parse DXF entities into geometry, (3) map geometry to the site
 * graph, (4) call the LLM only for semantic reasoning. Until then it fails fast.
 */
import {
  ParserStrategy,
  type DrawingParser,
  type ParseInput,
  type ParseOutput,
} from '@/lib/ai/parsers/DrawingParser';
import { AIError } from '@/lib/errors';
import type { GeminiLLM } from '@/lib/ai/LLM';
import type { Logger } from '@/lib/logger';

export class DxfGeometryParser implements DrawingParser {
  readonly strategy = ParserStrategy.DXF_GEOMETRY;
  private readonly llm: GeminiLLM;

  constructor(llm: GeminiLLM) {
    this.llm = llm;
  }

  async parse(_input: ParseInput, log: Logger): Promise<ParseOutput> {
    log.warn('parser.dxf_geometry.not_implemented');
    // Extension point: DWG->DXF conversion + deterministic geometry extraction
    // will feed the LLM with structured primitives instead of raw bytes.
    void this.llm; // reserved for the reasoning step once geometry extraction lands
    return Promise.reject(
      new AIError(
        'DXF geometry parsing strategy is not yet implemented. ' +
          "Set DRAWING_PARSER_STRATEGY='gemini_direct' for the POC.",
      ),
    );
  }
}
