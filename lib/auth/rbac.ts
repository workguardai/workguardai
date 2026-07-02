/**
 * Role-based access control (RBAC) primitives.
 *
 * Responsibility: Define the capability model and pure predicates that decide
 * whether a role may perform a capability. These functions are side-effect free;
 * resource ownership/membership lookups live in the service layer, which combines
 * a membership's `Role` with these predicates.
 *
 * Extension point: add a `Capability` and extend `ROLE_CAPABILITIES`. Roles are
 * the Prisma `Role` enum (ADMIN, MANAGER, VIEWER, PILOT).
 */
import { Role } from '@prisma/client';

import { ForbiddenError } from '@/lib/errors';

/** Discrete actions guarded by RBAC. */
export const Capability = {
  MANAGE_ORGANIZATION: 'MANAGE_ORGANIZATION',
  MANAGE_MEMBERS: 'MANAGE_MEMBERS',
  MANAGE_PROJECT: 'MANAGE_PROJECT',
  MANAGE_SITE: 'MANAGE_SITE',
  UPLOAD_DRAWING: 'UPLOAD_DRAWING',
  RUN_EVALUATION: 'RUN_EVALUATION',
  VIEW_DASHBOARD: 'VIEW_DASHBOARD',
  VIEW_ALERTS: 'VIEW_ALERTS',
} as const;

export type Capability = (typeof Capability)[keyof typeof Capability];

const ALL_CAPABILITIES: readonly Capability[] = Object.values(Capability);

const WRITE_AND_VIEW: readonly Capability[] = [
  Capability.MANAGE_PROJECT,
  Capability.MANAGE_SITE,
  Capability.UPLOAD_DRAWING,
  Capability.RUN_EVALUATION,
  Capability.VIEW_DASHBOARD,
  Capability.VIEW_ALERTS,
];

const VIEW_ONLY: readonly Capability[] = [Capability.VIEW_DASHBOARD, Capability.VIEW_ALERTS];

/**
 * Capability grants per role.
 *  - ADMIN: everything, including org and member management.
 *  - MANAGER: full project/site/drawing/evaluation lifecycle, no org management.
 *  - PILOT: same operational capabilities as MANAGER, but the service layer
 *    additionally enforces pilot usage limits.
 *  - VIEWER: read-only.
 */
const ROLE_CAPABILITIES: Record<Role, readonly Capability[]> = {
  [Role.ADMIN]: ALL_CAPABILITIES,
  [Role.MANAGER]: WRITE_AND_VIEW,
  [Role.PILOT]: WRITE_AND_VIEW,
  [Role.VIEWER]: VIEW_ONLY,
};

/** Pure predicate: does `role` grant `capability`? */
export function can(role: Role, capability: Capability): boolean {
  return ROLE_CAPABILITIES[role].includes(capability);
}

/** Throw `ForbiddenError` unless `role` grants `capability`. */
export function assertCan(role: Role, capability: Capability): void {
  if (!can(role, capability)) {
    throw new ForbiddenError(`Role ${role} may not perform ${capability}`);
  }
}
