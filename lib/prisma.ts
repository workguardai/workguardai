/**
 * Prisma client singleton.
 *
 * Responsibility: Provide a single, shared `PrismaClient` instance for the whole
 * server process. Next.js hot-reloads modules in development, which would
 * otherwise open a new connection pool on every reload and exhaust the database.
 *
 * Inputs:  DATABASE_URL (via generated client / env).
 * Outputs: `prisma` — the shared client.
 *
 * Assumptions:
 *  - Imported only on the server. Never bundle into client components.
 *
 * Extension point: swap logging or add middleware/extensions here in one place.
 */
import { PrismaClient } from '@prisma/client';

import { env } from '@/lib/env';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createClient(): PrismaClient {
  return new PrismaClient({
    log: env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });
}

export const prisma: PrismaClient = globalForPrisma.prisma ?? createClient();

if (env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
