'use client';

import Link from 'next/link';
import { Bell } from 'lucide-react';

import { cn } from '@/lib/cn';
import { buttonClasses } from '@/components/ui/buttonClasses';
import { AppShell } from '@/components/app/AppShell';
import { EmptyState, ErrorState, Skeleton } from '@/components/app/DataStates';
import { useWorkspace } from '@/hooks/useWorkspace';
import { useGetAlertsQuery, type AlertSeverity } from '@/store/api';

const TONE: Record<AlertSeverity, string> = {
  INFO: 'bg-info-soft text-info',
  LOW: 'bg-info-soft text-info',
  MEDIUM: 'bg-warning-soft text-warning',
  HIGH: 'bg-warning-soft text-warning',
  CRITICAL: 'bg-danger-soft text-danger',
};

export function AlertsScreen() {
  const ws = useWorkspace();
  const alerts = useGetAlertsQuery(ws.siteId ?? '', { skip: !ws.siteId });

  return (
    <AppShell title="Alerts">
      {ws.isLoading || (Boolean(ws.siteId) && alerts.isLoading) ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-2xl" />
          ))}
        </div>
      ) : ws.isError ? (
        <ErrorState message="We could not load your workspace." onRetry={ws.refetch} />
      ) : ws.needsOnboarding ? (
        <EmptyState
          icon={Bell}
          title="No alerts yet"
          description="Create your first site and upload a drawing to start getting alerts."
          action={
            <Link href="/onboarding" className={buttonClasses({ size: 'md' })}>
              Get started
            </Link>
          }
        />
      ) : alerts.isError ? (
        <ErrorState message="We could not load alerts." onRetry={() => alerts.refetch()} />
      ) : (alerts.data?.length ?? 0) === 0 ? (
        <EmptyState
          icon={Bell}
          title="No alerts"
          description="You are all caught up. New alerts appear here as work progresses on your sites."
        />
      ) : (
        <ul className="flex flex-col divide-y divide-line rounded-2xl border border-line bg-raised">
          {alerts.data!.map((a) => (
            <li key={a.id} className="flex items-start gap-4 p-5">
              <span
                className={cn(
                  'rounded-full px-2.5 py-0.5 text-caption font-medium',
                  TONE[a.severity] ?? 'bg-sunken text-ink-muted',
                )}
              >
                {a.severity}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-body font-medium text-ink">{a.title}</p>
                <p className="mt-0.5 text-small text-ink-soft">{a.reason}</p>
                {a.recommendation ? (
                  <p className="mt-1 text-small text-accent">{a.recommendation}</p>
                ) : null}
              </div>
              <span className="shrink-0 text-caption text-ink-muted">
                {new Date(a.createdAt).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}
