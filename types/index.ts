/**
 * Shared domain and request types.
 *
 * Responsibility: Cross-cutting TypeScript types used by handlers, services and
 * repositories. Keep framework-agnostic; Prisma model types are imported from
 * `@prisma/client` directly where needed.
 */
import type { Role } from '@prisma/client';

import type { Logger } from '@/lib/logger';

/** Authenticated principal derived from a validated Supabase session. */
export interface AuthUser {
  id: string;
  email: string;
  fullName: string | null;
}

/** Per-request context threaded through the handler pipeline. */
export interface RequestContext {
  correlationId: string;
  logger: Logger;
}

/** Request context guaranteed to carry an authenticated user. */
export interface AuthedRequestContext extends RequestContext {
  user: AuthUser;
}

/** A user's effective role within a specific project. */
export interface ProjectRole {
  projectId: string;
  role: Role;
}
