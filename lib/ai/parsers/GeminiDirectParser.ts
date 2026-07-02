/**
 * GeminiDirectParser (active default strategy: `gemini_direct`).
 *
 * Responsibility: Hand the raw uploaded file directly to Gemini multimodal and
 * receive a structured site graph. This is the POC strategy — no local geometry
 * extraction. The file is sent as an inline base64 part alongside a text
 * instruction; the response is validated against `siteGraphSchema`.
 *
 * Assumptions: file size is bounded upstream (see `Upload.MAX_FILE_BYTES`) so
 * inlining base64 is acceptable. For very large files a Files API upload would
 * be preferable — a future refinement that does not change this interface.
 */
import { ParserStrategy, type DrawingParser, type ParseInput, type ParseOutput } from '@/lib/ai/parsers/DrawingParser';
import { siteGraphSchema } from '@/lib/ai/schemas/siteGraph';
import { PARSER_SYSTEM_PROMPT } from '@/lib/ai/prompts/systemPrompt';
import type { GeminiLLM, PromptPart } from '@/lib/ai/LLM';
import type { Logger } from '@/lib/logger';

function toBase64(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString('base64');
}

export class GeminiDirectParser implements DrawingParser {
  readonly strategy = ParserStrategy.GEMINI_DIRECT;
  private readonly llm: GeminiLLM;

  constructor(llm: GeminiLLM) {
    this.llm = llm;
  }

  async parse(input: ParseInput, log: Logger): Promise<ParseOutput> {
    log.info('parser.gemini_direct.start', {
      fileName: input.fileName,
      mimeType: input.mimeType,
      bytes: input.bytes.byteLength,
    });

    const parts: PromptPart[] = [
      {
        text:
          `Analyze the attached engineering drawing "${input.fileName}". ` +
          `Produce the normalized site graph as JSON conforming to the required schema. ` +
          `Extract zones, adjacency/dependency edges and utilities. Only include measurements ` +
          `you can justify from the drawing; otherwise use null and lower confidence.`,
      },
      { inlineData: { mimeType: input.mimeType, data: toBase64(input.bytes) } },
    ];

    const result = await this.llm.generateStructured({
      systemPrompt: PARSER_SYSTEM_PROMPT,
      parts,
      schema: siteGraphSchema,
      label: 'parse.gemini_direct',
    });

    return {
      strategy: this.strategy,
      graph: result.data,
      confidence: result.data.overallConfidence,
      usage: result.usage,
      costUsd: result.costUsd,
    };
  }
}
