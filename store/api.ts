/**
 * RTK Query API slice — the single client data layer.
 *
 * Talks to the app's own Route Handlers under /api. Every endpoint unwraps the
 * standard success envelope ({ ok, data, meta }) so components receive the DTO
 * directly. Uses native fetch under the hood (fetchBaseQuery). Cache tags drive
 * automatic refetching after mutations.
 */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export { apiErrorMessage } from '@/lib/apiError';

// --- DTOs (client-side mirrors of the server Zod schemas) ---
export interface AuthUser {
  id: string;
  email: string;
  fullName: string | null;
}
export interface Membership {
  projectId: string;
  role: string;
}
export interface Session {
  user: AuthUser;
  memberships: Membership[];
}
export interface Organization {
  id: string;
  name: string;
  createdAt: string;
}
export interface Project {
  id: string;
  organizationId: string;
  name: string;
  description: string | null;
  createdAt: string;
}
export interface Site {
  id: string;
  projectId: string;
  name: string;
  location: string | null;
  createdAt: string;
}
export type AlertSeverity = 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export interface Alert {
  id: string;
  siteId: string;
  category: string;
  severity: AlertSeverity;
  title: string;
  reason: string;
  recommendation: string | null;
  confidence: number | null;
  resolvedAt: string | null;
  createdAt: string;
}
export interface Drawing {
  id: string;
  siteId: string;
  originalName: string;
  mimeType: string | null;
  fileSize: number | null;
  status: string;
  latestVersion: number;
  createdAt: string;
}
export interface DashboardPayload {
  siteId: string;
  isPreview: boolean;
  watermark: string | null;
  generatedAt: string;
  data: unknown;
}
export interface Subscription {
  organizationId: string;
  tier: string;
  status: string;
  usage: {
    projectCount: number;
    siteCount: number;
    drawingCount: number;
    aiEvaluationCount: number;
    alertCount: number;
  };
  limits: {
    maxProjects: number;
    maxSites: number;
    maxDrawings: number;
    maxAiEvaluations: number;
    maxAlerts: number;
  };
}
export interface Notification {
  id: string;
  title: string;
  body: string;
  status: 'UNREAD' | 'READ';
  alertId: string | null;
  createdAt: string;
}
export interface EvaluationSummary {
  evaluationId: string;
  drawingId: string;
  status: string;
  milestonesCreated: number;
  deviationsCreated: number;
  alertsCreated: number;
  expectedPct: number;
  actualPct: number;
  costUsd: number | null;
}

/** Envelope returned by every endpoint. */
interface Envelope<T> {
  ok: boolean;
  data: T;
}

const unwrap = <T>(res: Envelope<T>): T => res.data;

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Session', 'Organizations', 'Projects', 'Sites', 'Drawings', 'Alerts', 'Dashboard', 'Subscription', 'Notifications'],
  endpoints: (build) => ({
    getSession: build.query<Session, void>({
      query: () => '/auth/session',
      transformResponse: unwrap,
      providesTags: ['Session'],
    }),
    getOrganizations: build.query<Organization[], void>({
      query: () => '/organizations',
      transformResponse: unwrap,
      providesTags: ['Organizations'],
    }),
    createOrganization: build.mutation<Organization, { name: string }>({
      query: (body) => ({ url: '/organizations', method: 'POST', body }),
      transformResponse: unwrap,
      invalidatesTags: ['Organizations'],
    }),
    getProjects: build.query<Project[], string>({
      query: (organizationId) => `/projects?organizationId=${organizationId}`,
      transformResponse: unwrap,
      providesTags: ['Projects'],
    }),
    createProject: build.mutation<Project, { organizationId: string; name: string; description?: string }>({
      query: (body) => ({ url: '/projects', method: 'POST', body }),
      transformResponse: unwrap,
      invalidatesTags: ['Projects'],
    }),
    getSites: build.query<Site[], string>({
      query: (projectId) => `/sites?projectId=${projectId}`,
      transformResponse: unwrap,
      providesTags: ['Sites'],
    }),
    createSite: build.mutation<Site, { projectId: string; name: string; location?: string }>({
      query: (body) => ({ url: '/sites', method: 'POST', body }),
      transformResponse: unwrap,
      invalidatesTags: ['Sites'],
    }),
    getDashboard: build.query<DashboardPayload, string>({
      query: (siteId) => `/sites/${siteId}/dashboard`,
      transformResponse: unwrap,
      providesTags: ['Dashboard'],
    }),
    getAlerts: build.query<Alert[], string>({
      query: (siteId) => `/sites/${siteId}/alerts`,
      transformResponse: unwrap,
      providesTags: ['Alerts'],
    }),
    getDrawings: build.query<Drawing[], string>({
      query: (siteId) => `/sites/${siteId}/drawings`,
      transformResponse: unwrap,
      providesTags: ['Drawings'],
    }),
    uploadDrawing: build.mutation<Drawing, { siteId: string; file: File }>({
      query: ({ siteId, file }) => {
        const form = new FormData();
        form.append('file', file);
        return { url: `/sites/${siteId}/drawings`, method: 'POST', body: form };
      },
      transformResponse: unwrap,
      invalidatesTags: ['Drawings', 'Subscription'],
    }),
    evaluateDrawing: build.mutation<EvaluationSummary, string>({
      query: (drawingId) => ({ url: `/drawings/${drawingId}/evaluate`, method: 'POST' }),
      transformResponse: unwrap,
      invalidatesTags: ['Dashboard', 'Alerts', 'Subscription'],
    }),
    getSubscription: build.query<Subscription, string>({
      query: (organizationId) => `/subscription?organizationId=${organizationId}`,
      transformResponse: unwrap,
      providesTags: ['Subscription'],
    }),
    getNotifications: build.query<Notification[], void>({
      query: () => '/notifications?page=1&pageSize=20',
      transformResponse: unwrap,
      providesTags: ['Notifications'],
    }),
  }),
});

export const {
  useGetSessionQuery,
  useGetOrganizationsQuery,
  useCreateOrganizationMutation,
  useGetProjectsQuery,
  useCreateProjectMutation,
  useGetSitesQuery,
  useCreateSiteMutation,
  useGetDashboardQuery,
  useGetAlertsQuery,
  useGetDrawingsQuery,
  useUploadDrawingMutation,
  useEvaluateDrawingMutation,
  useGetSubscriptionQuery,
  useGetNotificationsQuery,
} = api;
