'use client';

import Link from 'next/link';
import { LayoutDashboard, TriangleAlert, ArrowRight } from 'lucide-react';

import { cn } from '@/lib/cn';
import { buttonClasses } from '@/components/ui/buttonClasses';
import { AppShell } from '@/components/app/AppShell';
import { EmptyState, ErrorState, Skeleton } from '@/components/app/DataStates';
import { useWorkspace } from '@/hooks/useWorkspace';
import { useGetSubscriptionQuery, useGetAlertsQuery, type AlertSeverity } from '@/store/api';

const TONE: Record<AlertSeverity, string> = {
  INFO: 'text-info',
  LOW: 'text-info',
  MEDIUM: 'text-warning',
  HIGH: 'text-warning',
  CRITICAL: 'text-danger',
};

export function DashboardScreen() {
  const ws = useWorkspace();
  const sub = useGetSubscriptionQuery(ws.organizationId ?? '', { skip: !ws.organizationId });
  const alerts = useGetAlertsQuery(ws.siteId ?? '', { skip: !ws.siteId });

  if (ws.isLoading) {
    return (
      <AppShell title="Dashboard">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="mt-6 h-64 rounded-2xl" />
      </AppShell>
    );
  }

  if (ws.isError) {
    return (
      <AppShell title="Dashboard">
        <ErrorState message="We could not load your workspace." onRetry={ws.refetch} />
      </AppShell>
    );
  }

  if (ws.needsOnboarding) {
    return (
      <AppShell title="Dashboard">
        <EmptyState
          icon={LayoutDashboard}
          title="Welcome to WorkGuard AI"
          description="Create your first site and upload a drawing to see your live progress dashboard."
          action={
            <Link href="/onboarding" className={buttonClasses({ size: 'lg' })}>
              Get started
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          }
        />
      </AppShell>
    );
  }

  const usage = sub.data?.usage;
  const stats = [
    { label: 'Sites', value: usage?.siteCount ?? ws.sites.length },
    { label: 'Drawings', value: usage?.drawingCount ?? 0 },
    { label: 'Evaluations', value: usage?.aiEvaluationCount ?? 0 },
    { label: 'Alerts', value: usage?.alertCount ?? alerts.data?.length ?? 0 },
  ];

  return (
    <AppShell title="Dashboard">
      <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-line bg-raised p-5">
            <dt className="text-small text-ink-muted">{s.label}</dt>
            <dd className="mt-1 text-h2 font-extrabold tracking-tight text-ink">{s.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-line bg-raised p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <p className="text-caption font-semibold uppercase tracking-wide text-ink-muted">Sites</p>
            <Link href="/sites" className="text-small font-medium text-accent hover:underline">
              Manage
            </Link>
          </div>
          <ul className="mt-4 flex flex-col divide-y divide-line">
            {ws.sites.map((site) => (
              <li key={site.id} className="flex items-center justify-between py-3">
                <span className="text-body font-medium text-ink">{site.name}</span>
                <span className="text-caption text-ink-muted">{site.location ?? 'No location'}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-line bg-raised p-6">
          <p className="text-caption font-semibold uppercase tracking-wide text-ink-muted">Recent alerts</p>
          {alerts.data && alerts.data.length > 0 ? (
            <ul className="mt-3 flex flex-col gap-3">
              {alerts.data.slice(0, 5).map((a) => (
                <li key={a.id} className="flex items-start gap-2 text-small text-ink-soft">
                  <TriangleAlert className={cn('mt-0.5 size-4 shrink-0', TONE[a.severity])} aria-hidden />
                  <span className="truncate">{a.title}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-small text-ink-muted">No alerts yet.</p>
          )}
        </div>
      </div>
    </AppShell>
  );
}
