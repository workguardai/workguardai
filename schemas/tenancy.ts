/**
 * Tenancy API schemas (organization, project, site).
 *
 * Responsibility: Validate create requests and response DTOs for the tenancy
 * hierarchy. Timestamps are serialized as ISO strings at the API boundary.
 */
import { z } from 'zod';

const isoTimestamp = z.string();

// --- Organization ---
export const createOrganizationRequest = z.object({
  name: z.string().min(1).max(120),
});
export type CreateOrganizationRequest = z.infer<typeof createOrganizationRequest>;

export const organizationDto = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: isoTimestamp,
});
export const organizationListDto = z.array(organizationDto);

// --- Project ---
export const createProjectRequest = z.object({
  organizationId: z.string().min(1),
  name: z.string().min(1).max(120),
  description: z.string().max(2000).optional(),
});
export type CreateProjectRequest = z.infer<typeof createProjectRequest>;

export const projectDto = z.object({
  id: z.string(),
  organizationId: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  createdAt: isoTimestamp,
});
export const projectListDto = z.array(projectDto);

export const listProjectsQuery = z.object({
  organizationId: z.string().min(1),
});

// --- Site ---
export const createSiteRequest = z.object({
  projectId: z.string().min(1),
  name: z.string().min(1).max(120),
  location: z.string().max(240).optional(),
});
export type CreateSiteRequest = z.infer<typeof createSiteRequest>;

export const siteDto = z.object({
  id: z.string(),
  projectId: z.string(),
  name: z.string(),
  location: z.string().nullable(),
  createdAt: isoTimestamp,
});
export const siteListDto = z.array(siteDto);

export const listSitesQuery = z.object({
  projectId: z.string().min(1),
});
