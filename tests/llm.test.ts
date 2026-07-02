/**
 * AI-output tests for the Gemini wrapper.
 *
 * Uses a fake `GenerativeBackend` so no network is touched. Verifies JSON
 * enforcement (fenced output stripped), Zod validation, cost/token accounting,
 * retry-then-succeed, and failure after exhausting retries.
 */
import { describe, it, expect, vi } from 'vitest';

import { GeminiLLM, type GenerativeBackend } from '@/lib/ai/LLM';
import { siteGraphSchema } from '@/lib/ai/schemas/siteGraph';
import { AIError } from '@/lib/errors';
import { createLogger } from '@/lib/logger';
import { validSiteGraph } from '@/tests/fixtures';

const silentLog = createLogger();
// Silence output during tests.
vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
vi.spyOn(process.stderr, 'write').mockImplementation(() => true);

function backendReturning(text: string): GenerativeBackend {
  return {
    generateContent: vi.fn().mockResolvedValue({
      text,
      usageMetadata: { promptTokenCount: 100, candidatesTokenCount: 50 },
    }),
  };
}

const baseOptions = {
  systemPrompt: 'sys',
  parts: [{ text: 'user' }],
  schema: siteGraphSchema,
};

describe('GeminiLLM.generateStructured', () => {
  it('parses and validates a clean JSON response and estimates cost', async () => {
    const llm = new GeminiLLM(backendReturning(JSON.stringify(validSiteGraph)), silentLog);
    const result = await llm.generateStructured(baseOptions);

    expect(result.data.overallConfidence).toBe(0.75);
    expect(result.usage).toEqual({ promptTokens: 100, completionTokens: 50 });
    expect(result.costUsd).toBeGreaterThan(0);
  });

  it('strips markdown code fences before parsing', async () => {
    const fenced = '```json\n' + JSON.stringify(validSiteGraph) + '\n```';
    const llm = new GeminiLLM(backendReturning(fenced), silentLog);
    const result = await llm.generateStructured(baseOptions);
    expect(result.data.zones).toHaveLength(1);
  });

  it('retries on a transient backend error then succeeds', async () => {
    const backend: GenerativeBackend = {
      generateContent: vi
        .fn()
        .mockRejectedValueOnce(new Error('503 transient'))
        .mockResolvedValueOnce({
          text: JSON.stringify(validSiteGraph),
          usageMetadata: { promptTokenCount: 10, candidatesTokenCount: 5 },
        }),
    };
    const llm = new GeminiLLM(backend, silentLog);

    vi.useFakeTimers();
    const promise = llm.generateStructured(baseOptions);
    await vi.runAllTimersAsync();
    const result = await promise;
    vi.useRealTimers();

    expect(backend.generateContent).toHaveBeenCalledTimes(2);
    expect(result.data.overallConfidence).toBe(0.75);
  });

  it('throws AIError after exhausting retries on invalid JSON', async () => {
    const llm = new GeminiLLM(backendReturning('not json at all'), silentLog);

    vi.useFakeTimers();
    const promise = llm.generateStructured(baseOptions);
    const assertion = expect(promise).rejects.toBeInstanceOf(AIError);
    await vi.runAllTimersAsync();
    await assertion;
    vi.useRealTimers();
  });
});
