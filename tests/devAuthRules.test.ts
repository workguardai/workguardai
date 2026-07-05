import { describe, it, expect } from 'vitest';

import { urlIsRealSupabase, computeDevAuthActive } from '@/lib/auth/devAuthRules';

describe('urlIsRealSupabase', () => {
  it('treats placeholder URLs as not real', () => {
    expect(urlIsRealSupabase('https://your-project.supabase.co')).toBe(false);
    expect(urlIsRealSupabase('https://placeholder.supabase.co')).toBe(false);
    expect(urlIsRealSupabase('')).toBe(false);
  });

  it('treats a genuine URL as real', () => {
    expect(urlIsRealSupabase('https://abcd1234.supabase.co')).toBe(true);
  });
});

describe('computeDevAuthActive', () => {
  const base = { nodeEnv: 'development', authMode: 'dev', supabaseUrl: 'https://your-project.supabase.co' };

  it('is active when enabled, non-prod, and Supabase is a placeholder', () => {
    expect(computeDevAuthActive(base)).toBe(true);
  });

  it('is disabled in production regardless of mode', () => {
    expect(computeDevAuthActive({ ...base, nodeEnv: 'production' })).toBe(false);
  });

  it('is disabled unless AUTH_MODE is dev', () => {
    expect(computeDevAuthActive({ ...base, authMode: 'supabase' })).toBe(false);
  });

  it('auto-disables the moment a real Supabase URL is present', () => {
    expect(computeDevAuthActive({ ...base, supabaseUrl: 'https://abcd1234.supabase.co' })).toBe(false);
  });
});
