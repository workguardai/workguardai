import Link from 'next/link';
import { Building2, Upload } from 'lucide-react';

import { cn } from '@/lib/cn';
import { buttonClasses } from '@/components/ui/buttonClasses';
import { AppShell } from '@/components/app/AppShell';

export function SitesScreen() {
  return (
    <AppShell title="Sites">
      <div className="mx-auto max-w-lg rounded-2xl border border-dashed border-line-strong bg-raised px-8 py-16 text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-xl bg-accent-soft text-accent">
          <Building2 className="size-6" aria-hidden />
        </span>
        <h2 className="mt-5 text-h4 font-semibold text-ink">No sites yet</h2>
        <p className="mx-auto mt-2 max-w-sm text-body text-ink-soft">
          Upload a construction drawing and WorkGuard AI will build your first live site model.
        </p>
        <Link href="/dashboard" className={cn('mt-6 inline-flex', buttonClasses({ size: 'md' }))}>
          <Upload className="size-4" aria-hidden />
          Upload a drawing
        </Link>
        <p className="mt-4 text-caption text-ink-muted">Your pilot includes one site.</p>
      </div>
    </AppShell>
  );
}
