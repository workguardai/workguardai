import { TrendingUp, TriangleAlert, CircleCheck } from 'lucide-react';

import { cn } from '@/lib/cn';
import { Container } from './Container';
import { Reveal } from './Reveal';

const SITES = [
  { n: 'Harbour Yard', p: 'Excavation', v: 67 },
  { n: 'Rautatie Line 4', p: 'Foundation', v: 41 },
  { n: 'Kaisa Tower', p: 'Framing', v: 88 },
  { n: 'Länsi Depot', p: 'Fit-out', v: 54 },
];

const FORECAST = [22, 30, 34, 44, 51, 58, 69, 74, 82];

export function DashboardShowcaseSection() {
  return (
    <section className="bg-sunken/40 py-24">
      <Container>
        <Reveal className="max-w-2xl">
          <h2 className="text-h2 font-bold text-ink">One dashboard for every site you run.</h2>
          <p className="mt-4 text-body-lg text-ink-soft">
            Progress, risk, forecasts, and alerts in a single view. No spreadsheets, no status calls,
            always current.
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-12 grid gap-4 md:auto-rows-[184px] md:grid-cols-4">
            {/* Overview (large) */}
            <div className="rounded-2xl border border-line bg-raised p-6 md:col-span-2 md:row-span-2">
              <p className="text-caption font-semibold uppercase tracking-wide text-ink-muted">
                Portfolio
              </p>
              <div className="mt-5 flex flex-col gap-4">
                {SITES.map((s) => (
                  <div key={s.n}>
                    <div className="flex items-center justify-between text-small">
                      <span className="font-medium text-ink">{s.n}</span>
                      <span className="text-caption text-ink-muted">{s.p}</span>
                    </div>
                    <div className="mt-1.5 flex items-center gap-3">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-sunken">
                        <div className="h-full rounded-full bg-ink" style={{ width: `${s.v}%` }} />
                      </div>
                      <span className="w-9 text-right font-mono text-caption text-ink-soft">{s.v}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Forecast (wide, chart) */}
            <div className="rounded-2xl border border-line bg-raised p-6 md:col-span-2">
              <div className="flex items-center justify-between">
                <p className="text-caption font-semibold uppercase tracking-wide text-ink-muted">
                  Completion forecast
                </p>
                <span className="inline-flex items-center gap-1 text-caption font-medium text-success">
                  <TrendingUp className="size-3.5" aria-hidden /> on pace
                </span>
              </div>
              <Sparkline values={FORECAST} className="mt-4" />
            </div>

            {/* Risk (accent-tinted) */}
            <div className="rounded-2xl border border-accent/30 bg-accent-soft/60 p-6">
              <p className="text-caption font-semibold uppercase tracking-wide text-accent">Risk score</p>
              <p className="mt-3 text-h1 font-extrabold tracking-tight text-ink">
                34<span className="text-h4 text-ink-muted">/100</span>
              </p>
              <p className="mt-1 text-caption text-ink-soft">Moderate, driven by Zone C</p>
            </div>

            {/* Alerts */}
            <div className="rounded-2xl border border-line bg-raised p-6">
              <p className="text-caption font-semibold uppercase tracking-wide text-ink-muted">Alerts</p>
              <ul className="mt-3 flex flex-col gap-2.5">
                <AlertRow icon={TriangleAlert} tone="text-warning" text="Line 4 trailing 3 days" />
                <AlertRow icon={CircleCheck} tone="text-success" text="Kaisa milestone met" />
              </ul>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

function AlertRow({
  icon: Icon,
  tone,
  text,
}: {
  icon: typeof TriangleAlert;
  tone: string;
  text: string;
}) {
  return (
    <li className="flex items-center gap-2 text-caption text-ink-soft">
      <Icon className={cn('size-3.5 shrink-0', tone)} aria-hidden />
      <span className="truncate">{text}</span>
    </li>
  );
}

function Sparkline({ values, className }: { values: number[]; className?: string }) {
  const w = 100;
  const h = 40;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || 1;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - ((v - min) / span) * h;
    return [x, y] as const;
  });
  const line = pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const area = `0,${h} ${line} ${w},${h}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className={cn('h-16 w-full', className)}>
      <polygon points={area} fill="var(--color-accent)" opacity="0.1" />
      <polyline
        points={line}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
