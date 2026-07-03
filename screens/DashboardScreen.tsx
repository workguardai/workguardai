import Link from 'next/link';
import { Info, TriangleAlert, CircleCheck, TrendingUp } from 'lucide-react';

import { cn } from '@/lib/cn';
import { buttonClasses } from '@/components/ui/buttonClasses';
import { AppShell } from '@/components/app/AppShell';

const SITES = [
  { n: 'Harbour Yard', p: 'Excavation', v: 67, status: 'On track', tone: 'success' as const },
  { n: 'Rautatie Line 4', p: 'Foundation', v: 41, status: '3d behind', tone: 'warning' as const },
  { n: 'Kaisa Tower', p: 'Framing', v: 88, status: '2d ahead', tone: 'info' as const },
  { n: 'Länsi Depot', p: 'Fit-out', v: 54, status: 'On track', tone: 'success' as const },
];

const TONE: Record<'success' | 'warning' | 'info', string> = {
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  info: 'bg-info-soft text-info',
};

const STATS = [
  { label: 'Active sites', value: '4' },
  { label: 'On track', value: '2' },
  { label: 'At risk', value: '1' },
  { label: 'Avg progress', value: '62%' },
];

export function DashboardScreen() {
  return (
    <AppShell title="Dashboard">
      <div className="flex items-center gap-3 rounded-xl border border-line bg-accent-soft/50 px-4 py-3">
        <Info className="size-4 shrink-0 text-accent" aria-hidden />
        <p className="text-small text-ink-soft">
          You are viewing preview data. Upload a drawing to start monitoring your own site.
        </p>
        <Link href="/sites" className={cn('ml-auto shrink-0', buttonClasses({ size: 'sm' }))}>
          Add a site
        </Link>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-xl border border-line bg-raised p-5">
            <dt className="text-small text-ink-muted">{s.label}</dt>
            <dd className="mt-1 text-h2 font-extrabold tracking-tight text-ink">{s.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-line bg-raised p-6 lg:col-span-2">
          <p className="text-caption font-semibold uppercase tracking-wide text-ink-muted">Sites</p>
          <div className="mt-5 flex flex-col gap-5">
            {SITES.map((s) => (
              <div key={s.n}>
                <div className="flex items-center justify-between text-small">
                  <span className="font-medium text-ink">{s.n}</span>
                  <span className={cn('rounded-full px-2 py-0.5 text-caption font-medium', TONE[s.tone])}>
                    {s.status}
                  </span>
                </div>
                <div className="mt-1.5 flex items-center gap-3">
                  <span className="w-20 shrink-0 text-caption text-ink-muted">{s.p}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-sunken">
                    <div className="h-full rounded-full bg-ink" style={{ width: `${s.v}%` }} />
                  </div>
                  <span className="w-9 text-right font-mono text-caption text-ink-soft">{s.v}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-accent/30 bg-accent-soft/50 p-6">
            <p className="text-caption font-semibold uppercase tracking-wide text-accent">Portfolio risk</p>
            <p className="mt-2 text-h1 font-extrabold tracking-tight text-ink">
              34<span className="text-h4 text-ink-muted">/100</span>
            </p>
            <p className="mt-1 inline-flex items-center gap-1 text-caption text-ink-soft">
              <TrendingUp className="size-3.5" aria-hidden /> improving week on week
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-raised p-6">
            <p className="text-caption font-semibold uppercase tracking-wide text-ink-muted">Recent alerts</p>
            <ul className="mt-3 flex flex-col gap-3">
              <li className="flex items-center gap-2 text-small text-ink-soft">
                <TriangleAlert className="size-4 shrink-0 text-warning" aria-hidden />
                Rautatie Line 4 trailing 3 days
              </li>
              <li className="flex items-center gap-2 text-small text-ink-soft">
                <CircleCheck className="size-4 shrink-0 text-success" aria-hidden />
                Kaisa Tower milestone met
              </li>
            </ul>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
