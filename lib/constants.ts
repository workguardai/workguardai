/**
 * Application-wide constants and enums.
 *
 * Responsibility: Centralize magic strings/numbers (cookie names, header names,
 * pilot-tier limits, pagination bounds) so they are defined exactly once.
 *
 * Extension point: add new limits/keys here; never inline literals elsewhere.
 */

/** HTTP header names used across the request lifecycle. */
export const HttpHeader = {
  CORRELATION_ID: 'x-correlation-id',
  CONTENT_TYPE: 'content-type',
} as const;

/** Cookie names owned by the application (Supabase manages its own auth cookies). */
export const CookieName = {
  CORRELATION_ID: 'wg_correlation_id',
} as const;

/** Auth cookie identifiers used for coarse session detection. */
export const AuthCookie = {
  /** Prefix Supabase uses for its auth token cookies. */
  SUPABASE_PREFIX: 'sb-',
  /** Cookie set by the dev-auth testing bypass (see lib/auth/devAuth.ts). */
  DEV_SESSION: 'wg_dev_session',
} as const;

/** Fixed identity used by the dev-auth bypass. */
export const DevAuthDefaults = {
  USER_ID: '00000000-0000-4000-8000-000000000001',
  FULL_NAME: 'Dev Tester',
} as const;

/** Standard content types. */
export const ContentType = {
  JSON: 'application/json',
} as const;

/** Pagination bounds shared by list endpoints. */
export const Pagination = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

/** Upload constraints. POC accepts any file type but still bounds size. */
export const Upload = {
  MAX_FILE_BYTES: 50 * 1024 * 1024, // 50 MB
} as const;

/**
 * Pilot (free) tier limits. The pilot experience is intentionally constrained
 * to demonstrate value while encouraging an upgrade. See CLAUDE.md "Pilot".
 */
export const PilotLimits = {
  MAX_ORGANIZATIONS: 1,
  MAX_PROJECTS: 1,
  MAX_SITES: 1,
  MAX_DRAWINGS: 1,
  MAX_AI_EVALUATIONS: 5,
  MAX_ALERTS: 20,
  DASHBOARD_HISTORY_DAYS: 7,
} as const;

/** Gemini model defaults. Overridable per-call in the LLM wrapper. */
export const GeminiDefaults = {
  MODEL: 'gemini-2.5-flash',
  TEMPERATURE: 0.1,
  MAX_RETRIES: 3,
  BASE_BACKOFF_MS: 500,
  MAX_BACKOFF_MS: 8000,
} as const;

/**
 * Approximate Gemini pricing (USD per 1M tokens) used only for internal cost
 * estimation hooks. Not authoritative billing — refresh from the provider.
 */
export const GeminiPricingPerMillionTokens = {
  INPUT_USD: 0.3,
  OUTPUT_USD: 2.5,
} as const;

/** Audit log action verbs. */
export const AuditAction = {
  ORGANIZATION_CREATED: 'organization.created',
  PROJECT_CREATED: 'project.created',
  SITE_CREATED: 'site.created',
  DRAWING_UPLOADED: 'drawing.uploaded',
  DRAWING_EVALUATED: 'drawing.evaluated',
  DASHBOARD_GENERATED: 'dashboard.generated',
  ALERTS_GENERATED: 'alerts.generated',
} as const;
