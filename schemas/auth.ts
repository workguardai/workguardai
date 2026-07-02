/**
 * Auth API schemas.
 *
 * Responsibility: Validate auth request bodies and the session response payload.
 */
import { z } from 'zod';
import { Role } from '@prisma/client';

export const registerRequest = z.object({
  email: z.email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().min(1).max(120).optional(),
});
export type RegisterRequest = z.infer<typeof registerRequest>;

export const loginRequest = z.object({
  email: z.email(),
  password: z.string().min(1),
});
export type LoginRequest = z.infer<typeof loginRequest>;

export const authUserDto = z.object({
  id: z.string(),
  email: z.email(),
  fullName: z.string().nullable(),
});

export const membershipDto = z.object({
  projectId: z.string(),
  role: z.enum(Role),
});

export const sessionResponse = z.object({
  user: authUserDto,
  memberships: z.array(membershipDto),
});

export const registerResponse = z.object({
  user: authUserDto,
  /** True when email confirmation is required before a session is active. */
  emailConfirmationRequired: z.boolean(),
});
