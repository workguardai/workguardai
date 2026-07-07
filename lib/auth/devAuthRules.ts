/**
 * Pure activation rules for the dev-auth bypass (no next/headers import, so it
 * is unit-testable). See devAuth.ts for the cookie/session side of it.
 */
export const PLACEHOLDER_MARKERS = ['placeholder', 'your-project', 'example'];

/** True once a genuine (non-placeholder) Supabase URL is configured. */
export function urlIsRealSupabase(url: string): boolean {
  if (url.length === 0) return false;
  return !PLACEHOLDER_MARKERS.some((marker) => url.includes(marker));
}

/** Whether the dev bypass should be active for the given environment. */
export function computeDevAuthActive(opts: {
  nodeEnv: string;
  authMode: string;
  supabaseUrl: string;
}): boolean {
  return (
    opts.nodeEnv !== 'production' &&
    opts.authMode === 'dev' &&
    !urlIsRealSupabase(opts.supabaseUrl)
  );
}
