/**
 * Repository shared types.
 *
 * Responsibility: Define the DB client type repositories accept so they can run
 * either standalone or inside a `$transaction`. Passing a `Prisma.TransactionClient`
 * lets a service compose multiple repository writes atomically.
 */
import type { Prisma } from '@prisma/client';

import { prisma } from '@/lib/prisma';

/** Either the root client or a transaction-scoped client. */
export type DbClient = Prisma.TransactionClient;

/** Default client used when a repository call is not part of a transaction. */
export const defaultDb: DbClient = prisma;
