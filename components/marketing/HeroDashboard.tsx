'use client';

/**
 * HeroDashboard — a live, animated preview of the real product surface, built
 * from the design system (not a fake screenshot). Progress bars fill on mount;
 * the alert line rotates every few seconds. Motion communicates "this is live";
 * it collapses to static under reduced-motion.
 */
import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Activity, TriangleAlert, CircleCheck } from 'lucide-react';

import { cn } from '@/lib/cn';

interface SiteRow {
  name: string;
  phase: string;
  pct: number;
  status: string;
  tone: 'success' | 'warning' | 'info';
}

const SITES: SiteRow[] = [
  { name: 'Harbour Yard', phase: 'Excavation', pct: 67, status: 'On track', tone: 'success' },
  { name: 'Rautatie Line 4', phase: 'Foundation', pct: 41, status: '3d behind', tone: 'warning' },
  { name: 'Kaisa Tower', phase: 'Framing', pct: 88, status: '2d ahead', tone: 'info' },
];

const TONE_CHIP: Record<SiteRow['tone'], string> = {
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  info: 'bg-info-soft text-info',
};

const ALERTS = [
  { icon: CircleCheck, text: 'Milestone met · Foundation pour, Harbour Yard', className: 'text-success' },
  { icon: TriangleAlert, text: 'Delay predicted · Rautatie Line 4, 3 days behind', className: 'text-warning' },
  { icon: TriangleAlert, text: 'Deviation flagged · unplanned work in Zone C', className: 'text-danger' },
];

export function HeroDashboard() {
  const reduce = useReducedMotion();
  const [alertIndex, setAlertIndex] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setAlertIndex((i) => (i + 1) % ALERTS.length), 3200);
    return () => clearInterval(id);
  }, [reduce]);

  const alert = ALERTS[alertIndex] ?? ALERTS[0]!;
  const AlertIcon = alert.icon;

  return (
    <div className="rounded-2xl border border-line bg-raised p-5 shadow-overlay">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="size-4 text-accent" aria-hidden />
          <span className="text-small font-semibold text-ink">WorkGuard</span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success-soft px-2 py-0.5 text-caption font-medium text-success">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-success" />
            </span>
            Live
          </span>
        </div>
        <span className="text-caption text-ink-muted">3 active sites</span>
      </div>

      <div className="mt-5 flex flex-col gap-4">
        {SITES.map((site, i) => (
          <div key={site.name}>
            <div className="flex items-center justify-between text-small">
              <span className="font-medium text-ink">{site.name}</span>
              <span className={cn('rounded-full px-2 py-0.5 text-caption font-medium', TONE_CHIP[site.tone])}>
                {site.status}
              </span>
            </div>
            <div className="mt-1.5 flex items-center gap-3">
              <span className="w-20 shrink-0 text-caption text-ink-muted">{site.phase}</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-sunken">
                <motion.div
                  className="h-full rounded-full bg-ink"
                  initial={reduce ? false : { width: 0 }}
                  animate={{ width: `${site.pct}%` }}
                  transition={{ duration: 0.9, delay: 0.2 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
              <span className="w-9 shrink-0 text-right font-mono text-caption text-ink-soft">{site.pct}%</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-lg bg-sunken/70 p-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={alertIndex}
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2"
          >
            <AlertIcon className={cn('size-4 shrink-0', alert.className)} aria-hidden />
            <span className="truncate text-caption text-ink-soft">{alert.text}</span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
