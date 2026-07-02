/**
 * Gemini LLM wrapper.
 *
 * Responsibility: A single, reusable entry point for structured Gemini calls.
 * It owns model selection, temperature, JSON enforcement, retries with
 * exponential backoff, Zod validation of the response, and token/cost hooks with
 * structured logging. It NEVER returns raw strings — only validated JSON.
 *
 * Inputs:  a system prompt, prompt parts (text and/or inline files), and a Zod
 *          output schema.
 * Outputs: `{ data, usage, costUsd }` where `data` is parsed+validated `T`.
 *
 * Extension point: the generative backend is injected (`GenerativeBackend`), so
 * tests supply a fake and production uses the real `@google/genai` client. Swap
 * models/pricing via `lib/constants.ts`.
 */
import { GoogleGenAI } from '@google/genai';
import type { z } from 'zod';

import { env } from '@/lib/env';
import { AIError } from '@/lib/errors';
import { logger, type Logger } from '@/lib/logger';
import { GeminiDefaults, GeminiPricingPerMillionTokens } from '@/lib/constants';

/** A single piece of prompt input: text or an inline binary (e.g. a drawing). */
export type PromptPart = { text: string } | { inlineData: { mimeType: string; data: string } };

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
}

export interface StructuredResult<T> {
  data: T;
  usage: TokenUsage;
  costUsd: number;
}

/** Minimal shape of a Gemini `generateContent` response we depend on. */
export interface BackendResponse {
  text?: string;
  usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number };
}

export interface BackendRequest {
  model: string;
  contents: PromptPart[];
  config: {
    systemInstruction: string;
    temperature: number;
    responseMimeType: string;
  };
}

/** Injectable generative backend (the real client, or a fake in tests). */
export interface GenerativeBackend {
  generateContent(request: BackendRequest): Promise<BackendResponse>;
}

export interface GenerateStructuredOptions<TSchema extends z.ZodTypeAny> {
  systemPrompt: string;
  parts: PromptPart[];
  schema: TSchema;
  model?: string;
  temperature?: number;
  /** For logging/tracing which stage produced the call. */
  label?: string;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function backoffDelay(attempt: number): number {
  const exp = Math.min(
    GeminiDefaults.MAX_BACKOFF_MS,
    GeminiDefaults.BASE_BACKOFF_MS * 2 ** attempt,
  );
  // Full jitter to avoid thundering herd.
  return Math.floor(Math.random() * exp);
}

function estimateCostUsd(usage: TokenUsage): number {
  const inputCost = (usage.promptTokens / 1_000_000) * GeminiPricingPerMillionTokens.INPUT_USD;
  const outputCost =
    (usage.completionTokens / 1_000_000) * GeminiPricingPerMillionTokens.OUTPUT_USD;
  return Number((inputCost + outputCost).toFixed(6));
}

/** Strip markdown code fences if the model wrapped its JSON despite instructions. */
function extractJson(raw: string): string {
  const trimmed = raw.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
  return fenced?.[1]?.trim() ?? trimmed;
}

export class GeminiLLM {
  private readonly backend: GenerativeBackend;
  private readonly log: Logger;

  constructor(backend: GenerativeBackend, log: Logger = logger) {
    this.backend = backend;
    this.log = log.child({ component: 'GeminiLLM' });
  }

  /**
   * Run a structured generation with retries. Retries cover transient backend
   * errors AND invalid/unparseable output, since a re-roll often succeeds.
   * Throws `AIError` after exhausting retries.
   */
  async generateStructured<TSchema extends z.ZodTypeAny>(
    options: GenerateStructuredOptions<TSchema>,
  ): Promise<StructuredResult<z.infer<TSchema>>> {
    const model = options.model ?? GeminiDefaults.MODEL;
    const temperature = options.temperature ?? GeminiDefaults.TEMPERATURE;
    const label = options.label ?? 'generate';

    let lastError: unknown;

    for (let attempt = 0; attempt <= GeminiDefaults.MAX_RETRIES; attempt++) {
      if (attempt > 0) {
        const delay = backoffDelay(attempt);
        this.log.warn('gemini.retry', { label, attempt, delay });
        await sleep(delay);
      }

      try {
        const response = await this.backend.generateContent({
          model,
          contents: options.parts,
          config: {
            systemInstruction: options.systemPrompt,
            temperature,
            responseMimeType: 'application/json',
          },
        });

        const usage: TokenUsage = {
          promptTokens: response.usageMetadata?.promptTokenCount ?? 0,
          completionTokens: response.usageMetadata?.candidatesTokenCount ?? 0,
        };
        const costUsd = estimateCostUsd(usage);

        if (!response.text) {
          throw new AIError('Gemini returned an empty response');
        }

        const parsed: unknown = JSON.parse(extractJson(response.text));
        const validated = options.schema.parse(parsed);

        this.log.info('gemini.success', {
          label,
          model,
          attempt,
          promptTokens: usage.promptTokens,
          completionTokens: usage.completionTokens,
          costUsd,
        });

        return { data: validated, usage, costUsd };
      } catch (error) {
        lastError = error;
        this.log.warn('gemini.attempt_failed', {
          label,
          attempt,
          err: error instanceof Error ? error.message : String(error),
        });
      }
    }

    throw new AIError('Gemini failed to produce valid structured output', {
      label,
      cause: lastError instanceof Error ? lastError.message : String(lastError),
    });
  }
}

/** Default production backend backed by `@google/genai`. */
function createDefaultBackend(): GenerativeBackend {
  const client = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
  return {
    async generateContent(request) {
      const response = await client.models.generateContent(request);
      return {
        text: response.text,
        usageMetadata: response.usageMetadata,
      };
    },
  };
}

let singleton: GeminiLLM | undefined;

/** Lazily-constructed default LLM (avoids building the client at import time). */
export function getLLM(): GeminiLLM {
  if (!singleton) {
    singleton = new GeminiLLM(createDefaultBackend());
  }
  return singleton;
}
