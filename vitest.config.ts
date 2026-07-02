/**
 * Vitest configuration.
 *
 * - Node environment (backend code, no DOM).
 * - `@/` path alias mirrors tsconfig so imports resolve identically.
 * - `test.env` injects schema-valid placeholder env vars so modules that import
 *   `lib/env` (which fails fast on invalid config) load during tests. These are
 *   NOT real credentials; tests never touch live Supabase/Gemini/Postgres.
 */
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    globals: true,
    include: ['tests/**/*.test.ts'],
    env: {
      NODE_ENV: 'test',
      DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/workguardai_test',
      NEXT_PUBLIC_SUPABASE_URL: 'https://placeholder.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'placeholder-anon-key',
      SUPABASE_SERVICE_ROLE_KEY: 'placeholder-service-role-key',
      JWT_SECRET: 'placeholder-test-secret-please-change-32chars',
      GEMINI_API_KEY: 'placeholder-gemini-api-key',
      UPLOAD_BUCKET: 'drawings',
      DRAWING_PARSER_STRATEGY: 'gemini_direct',
    },
  },
});
