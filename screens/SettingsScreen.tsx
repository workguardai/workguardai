'use client';

import Link from 'next/link';

import { cn } from '@/lib/cn';
import { buttonClasses } from '@/components/ui/buttonClasses';
import { AppShell } from '@/components/app/AppShell';
import { DangerZone } from '@/components/app/DangerZone';
import { Skeleton } from '@/components/app/DataStates';
import { useWorkspace } from '@/hooks/useWorkspace';
import { useGetSessionQuery, useGetSubscriptionQuery } from '@/store/api';

function limitLabel(limit: number): string {
  return limit < 0 ? 'Unlimited' : String(limit);
}

export function SettingsScreen() {
  const session = useGetSessionQuery();
  const ws = useWorkspace();
  const sub = useGetSubscriptionQuery(ws.organizationId ?? '', { skip: !ws.organizationId });

  const user = session.data?.user;
  const tier = sub.data?.tier;
  const usage = sub.data?.usage;
  const limits = sub.data?.limits;

  const usageRows = usage && limits
    ? [
        { label: 'Sites', used: usage.siteCount, max: limits.maxSites },
        { label: 'Drawings', used: usage.drawingCount, max: limits.maxDrawings },
        { label: 'Evaluations', used: usage.aiEvaluationCount, max: limits.maxAiEvaluations },
        { label: 'Alerts', used: usage.alertCount, max: limits.maxAlerts },
      ]
    : [];

  return (
    <AppShell title="Settings">
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <section className="rounded-2xl border border-line bg-raised p-6">
          <h2 className="text-h4 font-semibold text-ink">Account</h2>
          {session.isLoading ? (
            <Skeleton className="mt-4 h-12 w-full" />
          ) : (
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-small text-ink-muted">Name</dt>
                <dd className="mt-1 text-body text-ink">{user?.fullName ?? 'Not set'}</dd>
              </div>
              <div>
                <dt className="text-small text-ink-muted">Email</dt>
                <dd className="mt-1 text-body text-ink">{user?.email ?? '—'}</dd>
              </div>
            </dl>
          )}
        </section>

        <section className="rounded-2xl border border-line bg-raised p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-h4 font-semibold text-ink">Plan</h2>
              {sub.isLoading ? (
                <Skeleton className="mt-2 h-5 w-40" />
              ) : (
                <p className="mt-1 text-small text-ink-soft">
                  You are on the{' '}
                  <span className="font-medium text-ink">{tier ? titleCase(tier) : 'Pilot'}</span> plan.
                </p>
              )}
            </div>
            {(!tier || tier === 'PILOT' || tier === 'FREE') && (
              <Link href="/pricing" className={cn('shrink-0', buttonClasses({ size: 'md' }))}>
                Upgrade
              </Link>
            )}
          </div>

          {usageRows.length > 0 ? (
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              {usageRows.map((row) => (
                <div key={row.label} className="rounded-xl border border-line bg-canvas p-4">
                  <dt className="text-small text-ink-muted">{row.label}</dt>
                  <dd className="mt-1 font-mono text-body text-ink">
                    {row.used} <span className="text-ink-muted">/ {limitLabel(row.max)}</span>
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
        </section>

        <DangerZone />
      </div>
    </AppShell>
  );
}

function titleCase(s: string): string {
  return s.charAt(0) + s.slice(1).toLowerCase();
}
