/**
 * Drawing repository.
 *
 * Responsibility: Persist uploaded drawings and their immutable versions. A new
 * upload creates a `Drawing` plus its first `DrawingVersion` atomically;
 * re-uploads append a new version. The latest version is what the AI evaluates.
 */
import type { Drawing, DrawingVersion, Prisma, ProcessingStatus } from '@prisma/client';

import { defaultDb, type DbClient } from '@/lib/repositories/types';

/** A drawing version joined with its parent drawing. */
export type VersionWithDrawing = Prisma.DrawingVersionGetPayload<{ include: { drawing: true } }>;

export const drawingRepository = {
  /** Create a drawing together with its first version (version 1). */
  async createWithFirstVersion(
    input: {
      siteId: string;
      originalName: string;
      storageKey: string;
      mimeType: string | null;
      fileSize: number | null;
    },
    db: DbClient = defaultDb,
  ): Promise<VersionWithDrawing> {
    const drawing = await db.drawing.create({
      data: {
        siteId: input.siteId,
        originalName: input.originalName,
        storageKey: input.storageKey,
        mimeType: input.mimeType,
        fileSize: input.fileSize,
        latestVersion: 1,
      },
    });

    return db.drawingVersion.create({
      data: { drawingId: drawing.id, version: 1, storageKey: input.storageKey },
      include: { drawing: true },
    });
  },

  async countActiveBySite(siteId: string, db: DbClient = defaultDb): Promise<number> {
    return db.drawing.count({ where: { siteId, deletedAt: null } });
  },

  async listBySite(siteId: string, db: DbClient = defaultDb): Promise<Drawing[]> {
    return db.drawing.findMany({
      where: { siteId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  },

  async findById(id: string, db: DbClient = defaultDb): Promise<Drawing | null> {
    return db.drawing.findFirst({ where: { id, deletedAt: null } });
  },

  /** The latest version of a drawing (what the AI pipeline evaluates). */
  async findLatestVersion(
    drawingId: string,
    db: DbClient = defaultDb,
  ): Promise<DrawingVersion | null> {
    return db.drawingVersion.findFirst({
      where: { drawingId },
      orderBy: { version: 'desc' },
    });
  },

  async setStatus(
    drawingId: string,
    status: ProcessingStatus,
    db: DbClient = defaultDb,
  ): Promise<void> {
    await db.drawing.update({ where: { id: drawingId }, data: { status } });
  },

  async setVersionStatus(
    versionId: string,
    status: ProcessingStatus,
    db: DbClient = defaultDb,
  ): Promise<void> {
    await db.drawingVersion.update({ where: { id: versionId }, data: { status } });
  },
};
