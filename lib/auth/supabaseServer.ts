/**
 * Supabase server clients.
 *
 * Responsibility: Construct request-scoped Supabase clients for use inside
 * Route Handlers and the proxy. Two flavors:
 *  - `createServerSupabase()` — anon-key client bound to the request cookie jar,
 *    used for reading the current session and performing auth flows (login,
 *    logout, OAuth code exchange). Refresh-token rotation is handled by the
 *    library writing updated auth cookies back through `setAll`.
 *  - `createAdminSupabase()` — service-role client with no user context, used
 *    only for privileged server operations (e.g. storage signing). Never expose.
 *
 * Assumptions: server-only. `SUPABASE_SERVICE_ROLE_KEY` must never reach a client
 * bundle — this module is never imported from a client component.
 */
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { env } from '@/lib/env';

/**
 * Cookie-bound anon client. Reads/writes Supabase auth cookies through Next's
 * async cookie store so sessions and refresh rotation persist correctly.
 */
export async function createServerSupabase(): Promise<SupabaseClient> {
  const cookieStore = await cookies();

  return createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        // In some contexts (e.g. rendering) cookies are read-only; ignore write
        // failures so session reads never crash the request.
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // no-op: not in a mutable cookie context
        }
      },
    },
  });
}

/**
 * Service-role client. Full privileges, no session persistence. Use sparingly
 * and only for operations that legitimately require bypassing RLS.
 */
export function createAdminSupabase(): SupabaseClient {
  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
