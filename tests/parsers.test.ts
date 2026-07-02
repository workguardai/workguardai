/**
 * Tests for the DrawingParser factory and implementations.
 *  - factory maps strategy -> concrete parser (the single swap point),
 *  - GeminiDirectParser produces a validated graph via a fake LLM,
 *  - DxfGeometryParser is stubbed and fails fast with AIError.
 */
import { describe, it, expect, vi } from 'vitest';

import { GeminiLLM, type GenerativeBackend } from '@/lib/ai/LLM';
import { getDrawingParser } from '@/lib/ai/parsers/factory';
import { GeminiDirectParser } from '@/lib/ai/parsers/GeminiDirectParser';
import { DxfGeometryParser } from '@/lib/ai/parsers/DxfGeometryParser';
import { ParserStrategy } from '@/lib/ai/parsers/DrawingParser';
import { AIError } from '@/lib/errors';
import { createLogger } from '@/lib/logger';
import { validSiteGraph } from '@/tests/fixtures';

vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
vi.spyOn(process.stderr, 'write').mockImplementation(() => true);
const log = createLogger();

function fakeLLM(text: string): GeminiLLM {
  const backend: GenerativeBackend = {
    generateContent: vi.fn().mockResolvedValue({
      text,
      usageMetadata: { promptTokenCount: 10, candidatesTokenCount: 5 },
    }),
  };
  return new GeminiLLM(backend, log);
}

const input = {
  fileName: 'plan.dwg',
  mimeType: 'application/octet-stream',
  bytes: new Uint8Array([1, 2, 3]),
};

describe('getDrawingParser factory', () => {
  it('returns GeminiDirectParser for gemini_direct', () => {
    const parser = getDrawingParser(ParserStrategy.GEMINI_DIRECT, fakeLLM('{}'));
    expect(parser).toBeInstanceOf(GeminiDirectParser);
    expect(parser.strategy).toBe(ParserStrategy.GEMINI_DIRECT);
  });

  it('returns DxfGeometryParser for dxf_geometry', () => {
    const parser = getDrawingParser(ParserStrategy.DXF_GEOMETRY, fakeLLM('{}'));
    expect(parser).toBeInstanceOf(DxfGeometryParser);
  });
});

describe('GeminiDirectParser', () => {
  it('returns a validated site graph', async () => {
    const parser = new GeminiDirectParser(fakeLLM(JSON.stringify(validSiteGraph)));
    const output = await parser.parse(input, log);
    expect(output.strategy).toBe(ParserStrategy.GEMINI_DIRECT);
    expect(output.confidence).toBe(0.75);
    expect(output.graph.zones).toHaveLength(1);
  });
});

describe('DxfGeometryParser (stub)', () => {
  it('rejects with AIError until implemented', async () => {
    const parser = new DxfGeometryParser(fakeLLM('{}'));
    await expect(parser.parse(input, log)).rejects.toBeInstanceOf(AIError);
  });
});
