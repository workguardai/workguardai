'use client';

import Link from 'next/link';
import { Building2 } from 'lucide-react';

import { buttonClasses } from '@/components/ui/buttonClasses';
import { AppShell } from '@/components/app/AppShell';
import { EmptyState, ErrorState, Skeleton } from '@/components/app/DataStates';
import { DrawingUpload } from '@/components/app/DrawingUpload';
import { useWorkspace } from '@/hooks/useWorkspace';

export function SitesScreen() {
  const ws = useWorkspace();

  return (
    <AppShell title="Sites">
      {ws.isLoading ? (
        <Skeleton className="h-52 w-full rounded-2xl" />
      ) : ws.isError ? (
        <ErrorState message="We could not load your sites." onRetry={ws.refetch} />
      ) : ws.needsOnboarding ? (
        <EmptyState
          icon={Building2}
          title="No sites yet"
          description="Create your first site and upload a construction drawing to start monitoring."
          action={
            <Link href="/onboarding" className={buttonClasses({ size: 'md' })}>
              Get started
            </Link>
          }
        />
      ) : (
        <div className="flex flex-col gap-6">
          {ws.sites.map((site) => (
            <section key={site.id} className="rounded-2xl border border-line bg-raised p-6">
              <h2 className="text-h4 font-semibold text-ink">{site.name}</h2>
              {site.location ? <p className="text-small text-ink-muted">{site.location}</p> : null}
              <div className="mt-5">
                <DrawingUpload siteId={site.id} />
              </div>
            </section>
          ))}
        </div>
      )}
    </AppShell>
  );
}
