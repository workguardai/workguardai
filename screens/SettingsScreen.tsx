import Link from 'next/link';

import { cn } from '@/lib/cn';
import { buttonClasses } from '@/components/ui/buttonClasses';
import { AppShell } from '@/components/app/AppShell';
import { DangerZone } from '@/components/app/DangerZone';

export function SettingsScreen() {
  return (
    <AppShell title="Settings">
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <section className="rounded-2xl border border-line bg-raised p-6">
          <h2 className="text-h4 font-semibold text-ink">Account</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-small text-ink-muted">Name</dt>
              <dd className="mt-1 text-body text-ink">Your name</dd>
            </div>
            <div>
              <dt className="text-small text-ink-muted">Email</dt>
              <dd className="mt-1 text-body text-ink">you@company.com</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-2xl border border-line bg-raised p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-h4 font-semibold text-ink">Plan</h2>
              <p className="mt-1 text-small text-ink-soft">
                You are on the <span className="font-medium text-ink">Pilot</span> plan: one site,
                limited evaluations.
              </p>
            </div>
            <Link href="/pricing" className={cn('shrink-0', buttonClasses({ size: 'md' }))}>
              Upgrade
            </Link>
          </div>
        </section>

        <DangerZone />
      </div>
    </AppShell>
  );
}
