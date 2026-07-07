/**
 * Environment validation.
 *
 * Responsibility: Parse and validate all environment variables once, at module
 * load, so the application fails fast on misconfiguration instead of crashing
 * deep inside a request.
 *
 * Inputs:  process.env
 * Outputs: `env` — a fully typed, validated, immutable config object.
 *
 * Assumptions:
 *  - Server-only secrets (DATABASE_URL, service keys, etc.) are never imported
 *    into client components. Only `NEXT_PUBLIC_*` values are safe on the client.
 *  - `NEXT_PUBLIC_*` vars are referenced explicitly (not dynamically) so Next.js
 *    can inline them at build time.
 *
 * Extension point: add a field to the relevant schema; validation is automatic.
 */
import { z } from 'zod';

/** Server-only variables. Never sent to the browser. */
const serverSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'SUPABASE_SERVICE_ROLE_KEY is required'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters'),
  GEMINI_API_KEY: z.string().min(1, 'GEMINI_API_KEY is required'),
  UPLOAD_BUCKET: z.string().min(1, 'UPLOAD_BUCKET is required'),
  /**
   * Selects the drawing-parsing strategy without touching upload/service/API code.
   *  - 'gemini_direct' (POC): hand the raw file to Gemini multimodal.
   *  - 'dxf_geometry'  (recommended): DWG -> DXF -> deterministic geometry -> Gemini reasoning.
   */
  DRAWING_PARSER_STRATEGY: z.enum(['gemini_direct', 'dxf_geometry']).default('gemini_direct'),
  /**
   * Authentication mode.
   *  - 'supabase' (default): real Supabase Auth.
   *  - 'dev': testing bypass with fixed credentials. ONLY takes effect when
   *    Supabase is not really configured and NODE_ENV is not production; a real
   *    Supabase URL disables it automatically (see lib/auth/devAuth.ts).
   */
  AUTH_MODE: z.enum(['supabase', 'dev']).default('supabase'),
  DEV_AUTH_EMAIL: z.string().default('dev@workguard.local'),
  DEV_AUTH_PASSWORD: z.string().default('devpassword'),
});

/** Public variables. Inlined into the client bundle — must not hold secrets. */
const clientSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url('NEXT_PUBLIC_SUPABASE_URL must be a valid URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'NEXT_PUBLIC_SUPABASE_ANON_KEY is required'),
});

const isServer = typeof window === 'undefined';

/**
 * The full application config type (server + public). Server modules import
 * `env` and access server-only fields; those fields are validated to be present
 * whenever code runs on the server. On the client only `NEXT_PUBLIC_*` fields are
 * populated at runtime — client code must reference only those (enforced by the
 * "server secrets never imported on the client" assumption above).
 */
export type AppEnv = z.infer<typeof serverSchema> & z.infer<typeof clientSchema>;

/**
 * On the server we validate the full config. On the client, server secrets are
 * absent by design, so we validate only the public subset.
 */
function loadEnv(): AppEnv {
  const publicValues = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };

  const schema = isServer ? serverSchema.merge(clientSchema) : clientSchema;
  const source = isServer ? { ...process.env, ...publicValues } : publicValues;

  const parsed = schema.safeParse(source);

  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `  - ${issue.path.join('.') || '(root)'}: ${issue.message}`)
      .join('\n');
    throw new Error(`Invalid environment configuration:\n${issues}`);
  }

  return Object.freeze(parsed.data) as AppEnv;
}

export const env = loadEnv();

export type Env = AppEnv;
