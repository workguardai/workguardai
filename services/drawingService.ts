/**
 * Drawing upload service (file processing pipeline entry point).
 *
 * Responsibility: Validate and store an uploaded drawing, then persist the
 * drawing + first version atomically and bump usage. POC policy: accept ANY file
 * type (loose validation) but bound the size. The parsing strategy that later
 * interprets the file is selected by the DrawingParser factory, so this service
 * is parser-agnostic.
 *
 * Inputs:  siteId + an uploaded file (name, mime, bytes).
 * Outputs: a drawing DTO. The stored object key is derived, never client-supplied.
 */
import { ProcessingStatus } from '@prisma/client';

import { prisma } from '@/lib/prisma';
import { AuditAction, Upload } from '@/lib/constants';
import { UploadError } from '@/lib/errors';
import { Capability } from '@/lib/auth/rbac';
import { requireCapabilityOnSite } from '@/lib/auth/authorization';
import { drawingRepository } from '@/lib/repositories/drawingRepository';
import { billingRepository } from '@/lib/repositories/billingRepository';
import { auditRepository } from '@/lib/repositories/auditRepository';
import { usageService } from '@/services/usageService';
import { getStorage } from '@/lib/storage';
import type { AuthUser } from '@/types';

export interface UploadFileInput {
  fileName: string;
  mimeType: string;
  bytes: Uint8Array;
}

/** Keep a filesystem/URL-safe object key; never trust the raw client name. */
function safeName(fileName: string): string {
  return fileName.replace(/[^A-Za-z0-9._-]/g, '_').slice(0, 120) || 'upload';
}

function toDto(d: {
  id: string;
  siteId: string;
  originalName: string;
  mimeType: string | null;
  fileSize: number | null;
  status: ProcessingStatus;
  latestVersion: number;
  createdAt: Date;
}) {
  return {
    id: d.id,
    siteId: d.siteId,
    originalName: d.originalName,
    mimeType: d.mimeType,
    fileSize: d.fileSize,
    status: d.status,
    latestVersion: d.latestVersion,
    createdAt: d.createdAt.toISOString(),
  };
}

export const drawingService = {
  async upload(user: AuthUser, siteId: string, file: UploadFileInput) {
    const { site } = await requireCapabilityOnSite(user.id, siteId, Capability.UPLOAD_DRAWING);
    const organizationId = site.project.organizationId;

    if (file.bytes.byteLength === 0) {
      throw new UploadError('Uploaded file is empty');
    }
    if (file.bytes.byteLength > Upload.MAX_FILE_BYTES) {
      throw new UploadError('Uploaded file exceeds the maximum allowed size', {
        max: Upload.MAX_FILE_BYTES,
        actual: file.bytes.byteLength,
      });
    }

    await usageService.assertCanUploadDrawing(organizationId);

    const storageKey = `${organizationId}/${siteId}/${crypto.randomUUID()}-${safeName(file.fileName)}`;
    await getStorage().upload(storageKey, file.bytes, file.mimeType);

    const version = await prisma.$transaction(async (tx) => {
      const created = await drawingRepository.createWithFirstVersion(
        {
          siteId,
          originalName: file.fileName,
          storageKey,
          mimeType: file.mimeType,
          fileSize: file.bytes.byteLength,
        },
        tx,
      );
      await billingRepository.incrementUsage(organizationId, 'drawingCount', 1, tx);
      await auditRepository.record(
        {
          organizationId,
          userId: user.id,
          action: AuditAction.DRAWING_UPLOADED,
          resourceType: 'Drawing',
          resourceId: created.drawingId,
          metadata: { storageKey, mimeType: file.mimeType, size: file.bytes.byteLength },
        },
        tx,
      );
      return created;
    });

    return toDto(version.drawing);
  },

  async listBySite(user: AuthUser, siteId: string) {
    await requireCapabilityOnSite(user.id, siteId, Capability.VIEW_DASHBOARD);
    const drawings = await drawingRepository.listBySite(siteId);
    return drawings.map(toDto);
  },
};
