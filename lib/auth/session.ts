/**
 * Session resolution.
 *
 * Responsibility: Turn the incoming request's Supabase auth cookies into a
 * validated `AuthUser`, or signal that the caller is anonymous. `getUser()`
 * verifies the JWT against Supabase (not just decoding it), so the identity is
 * trustworthy.
 *
 * Inputs:  request cookies (via the server Supabase client).
 * Outputs: `AuthUser | null` (getAuthUser) or a guaranteed `AuthUser`
 *          (requireAuthUser, which throws `UnauthorizedError`).
 */
import { UnauthorizedError } from '@/lib/errors';
import { createServerSupabase } from '@/lib/auth/supabaseServer';
import { isDevAuthActive, readDevSession } from '@/lib/auth/devAuth';
import type { AuthUser } from '@/types';

/** Resolve the current authenticated user, or `null` if anonymous. */
export async function getAuthUser(): Promise<AuthUser | null> {
  // Testing bypass: resolve from the dev cookie instead of Supabase.
  if (isDevAuthActive()) {
    return readDevSession();
  }

  const supabase = await createServerSupabase();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user || !data.user.email) {
    return null;
  }

  const meta = data.user.user_metadata ?? {};
  const fullName =
    typeof meta.full_name === 'string'
      ? meta.full_name
      : typeof meta.name === 'string'
        ? meta.name
        : null;

  return {
    id: data.user.id,
    email: data.user.email,
    fullName,
  };
}

/** Resolve the current user or throw `UnauthorizedError`. */
export async function requireAuthUser(): Promise<AuthUser> {
  const user = await getAuthUser();
  if (!user) {
    throw new UnauthorizedError();
  }
  return user;
}
