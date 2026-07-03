import { cn } from '@/lib/cn';
import { AppShell } from '@/components/app/AppShell';

const ALERTS = [
  { title: 'Delay predicted on Rautatie Line 4', detail: 'Foundation is trailing plan by 3 days.', sev: 'High', tone: 'warning' as const, when: '2h ago' },
  { title: 'Deviation flagged in Zone C', detail: 'Unplanned excavation detected against the drawing.', sev: 'Critical', tone: 'danger' as const, when: '5h ago' },
  { title: 'Milestone met at Kaisa Tower', detail: 'Framing reached its planned checkpoint.', sev: 'Info', tone: 'success' as const, when: '1d ago' },
];

const TONE: Record<'warning' | 'danger' | 'success', string> = {
  warning: 'bg-warning-soft text-warning',
  danger: 'bg-danger-soft text-danger',
  success: 'bg-success-soft text-success',
};

export function AlertsScreen() {
  return (
    <AppShell title="Alerts">
      <p className="text-small text-ink-muted">Preview data from a sample project.</p>
      <ul className="mt-4 flex flex-col divide-y divide-line rounded-2xl border border-line bg-raised">
        {ALERTS.map((a) => (
          <li key={a.title} className="flex items-start gap-4 p-5">
            <span className={cn('rounded-full px-2.5 py-0.5 text-caption font-medium', TONE[a.tone])}>
              {a.sev}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-body font-medium text-ink">{a.title}</p>
              <p className="mt-0.5 text-small text-ink-soft">{a.detail}</p>
            </div>
            <span className="shrink-0 text-caption text-ink-muted">{a.when}</span>
          </li>
        ))}
      </ul>
    </AppShell>
  );
}
