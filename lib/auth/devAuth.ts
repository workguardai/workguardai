/**
 * Dev-auth bypass (testing only).
 *
 * Lets you sign in with a fixed set of credentials WITHOUT a Supabase project,
 * so the app can be exercised before live keys exist. It is deliberately
 * self-disabling:
 *
 *   isDevAuthActive() === true  ONLY when ALL of:
 *     - NODE_ENV is not 'production', AND
 *     - AUTH_MODE === 'dev' (you explicitly turned it on), AND
 *     - Supabase is NOT really configured (URL still a placeholder).
 *
 * The moment a real Supabase URL is present, this returns false and every auth
 * path falls back to Supabase only. There is no way to enable it in production.
 */
import { cookies } from 'next/headers';

import { env } from '@/lib/env';
import { AuthCookie, DevAuthDefaults } from '@/lib/constants';
import { computeDevAuthActive, urlIsRealSupabase } from '@/lib/auth/devAuthRules';
import type { AuthUser } from '@/types';

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

/** True once a genuine (non-placeholder) Supabase URL is configured. */
export function isRealSupabaseConfigured(): boolean {
  return urlIsRealSupabase(env.NEXT_PUBLIC_SUPABASE_URL ?? '');
}

/** Whether the dev-auth bypass is currently in effect. */
export function isDevAuthActive(): boolean {
  return computeDevAuthActive({
    nodeEnv: env.NODE_ENV,
    authMode: env.AUTH_MODE,
    supabaseUrl: env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  });
}

/** The fixed identity returned while dev auth is active. */
export const devUser: AuthUser = {
  id: DevAuthDefaults.USER_ID,
  email: env.DEV_AUTH_EMAIL,
  fullName: DevAuthDefaults.FULL_NAME,
};

export function devCredentialsMatch(email: string, password: string): boolean {
  return (
    email.trim().toLowerCase() === env.DEV_AUTH_EMAIL.toLowerCase() &&
    password === env.DEV_AUTH_PASSWORD
  );
}

export async function setDevSession(): Promise<void> {
  const store = await cookies();
  store.set(AuthCookie.DEV_SESSION, devUser.id, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearDevSession(): Promise<void> {
  const store = await cookies();
  store.delete(AuthCookie.DEV_SESSION);
}

export async function readDevSession(): Promise<AuthUser | null> {
  const store = await cookies();
  return store.get(AuthCookie.DEV_SESSION) ? devUser : null;
}
