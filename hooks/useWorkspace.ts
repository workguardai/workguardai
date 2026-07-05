/**
 * Resolve the caller's active workspace context (organization -> project ->
 * site). Pilot accounts have one of each, so we take the first at each level.
 * Chains RTK Query hooks with `skip` until the previous id is known.
 */
import {
  useGetOrganizationsQuery,
  useGetProjectsQuery,
  useGetSitesQuery,
  type Site,
} from '@/store/api';

export interface Workspace {
  organizationId?: string;
  projectId?: string;
  siteId?: string;
  sites: Site[];
  isLoading: boolean;
  isError: boolean;
  /** Signed in and set up, but no site created yet. */
  needsOnboarding: boolean;
  refetch: () => void;
}

export function useWorkspace(): Workspace {
  const orgs = useGetOrganizationsQuery();
  const organizationId = orgs.data?.[0]?.id;

  const projects = useGetProjectsQuery(organizationId ?? '', { skip: !organizationId });
  const projectId = projects.data?.[0]?.id;

  const sites = useGetSitesQuery(projectId ?? '', { skip: !projectId });
  const siteId = sites.data?.[0]?.id;

  const isLoading = orgs.isLoading || projects.isLoading || sites.isLoading;
  const isError = Boolean(orgs.error || projects.error || sites.error);
  const needsOnboarding = !isLoading && !isError && (!organizationId || (sites.data?.length ?? 0) === 0);

  return {
    organizationId,
    projectId,
    siteId,
    sites: sites.data ?? [],
    isLoading,
    isError,
    needsOnboarding,
    refetch: () => {
      orgs.refetch();
      if (organizationId) projects.refetch();
      if (projectId) sites.refetch();
    },
  };
}
