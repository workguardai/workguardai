/**
 * Unit tests for RBAC predicates.
 */
import { describe, it, expect } from 'vitest';
import { Role } from '@prisma/client';

import { can, assertCan, Capability } from '@/lib/auth/rbac';
import { ForbiddenError } from '@/lib/errors';

describe('rbac', () => {
  it('admin can manage the organization', () => {
    expect(can(Role.ADMIN, Capability.MANAGE_ORGANIZATION)).toBe(true);
  });

  it('manager cannot manage the organization', () => {
    expect(can(Role.MANAGER, Capability.MANAGE_ORGANIZATION)).toBe(false);
  });

  it('viewer is read-only', () => {
    expect(can(Role.VIEWER, Capability.VIEW_DASHBOARD)).toBe(true);
    expect(can(Role.VIEWER, Capability.UPLOAD_DRAWING)).toBe(false);
  });

  it('pilot has operational write capabilities', () => {
    expect(can(Role.PILOT, Capability.UPLOAD_DRAWING)).toBe(true);
    expect(can(Role.PILOT, Capability.RUN_EVALUATION)).toBe(true);
  });

  it('assertCan throws ForbiddenError when denied', () => {
    expect(() => assertCan(Role.VIEWER, Capability.UPLOAD_DRAWING)).toThrow(ForbiddenError);
  });
});
