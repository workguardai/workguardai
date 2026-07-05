'use client';

/**
 * ROI calculator. Estimates annual loss from construction delays and the saving
 * WorkGuard AI could deliver, from four inputs. Methodology mirrors the public
 * model: delay cost taken as a conservative 8% of at-risk project value, with a
 * 60% reduction from real-time monitoring, against the €550/mo Pro plan.
 */
import { useMemo, useState } from 'react';
import { TrendingDown, Clock, PiggyBank } from 'lucide-react';

import { computeRoi } from '@/lib/roi';
import { Container } from './Container';
import { Reveal } from './Reveal';

const eur = (n: number) =>
  new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);

function Slider({
  id,
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (n: number) => string;
  onChange: (n: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-small font-medium text-ink">
          {label}
        </label>
        <span className="font-mono text-small font-semibold text-accent">{format(value)}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 w-full accent-[var(--color-accent)]"
      />
    </div>
  );
}

export function RoiCalculator() {
  const [sites, setSites] = useState(5);
  const [value, setValue] = useState(1_000_000);
  const [delayRate, setDelayRate] = useState(40);

  const result = useMemo(() => computeRoi({ sites, value, delayRate }), [sites, value, delayRate]);

  return (
    <section className="border-t border-line/60 py-24">
      <Container>
        <Reveal className="max-w-2xl">
          <h2 className="text-h2 font-bold text-ink">What are delays costing you?</h2>
          <p className="mt-4 text-body-lg text-ink-soft">
            Estimate your annual loss from construction delays, and what WorkGuard AI could save you.
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <div className="flex flex-col gap-8 rounded-2xl border border-line bg-raised p-7">
              <Slider id="roi-sites" label="Active sites" value={sites} min={1} max={50} step={1} format={(n) => String(n)} onChange={setSites} />
              <Slider id="roi-value" label="Average project value per site" value={value} min={100_000} max={20_000_000} step={100_000} format={eur} onChange={setValue} />
              <Slider id="roi-delay" label="Estimated delay rate" value={delayRate} min={0} max={100} step={5} format={(n) => `${n}%`} onChange={setDelayRate} />
              <p className="text-caption text-ink-muted">
                Industry average: 77% of projects face delays, typically costing 5 to 15% of value. This model uses a
                conservative 8%.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <Metric icon={TrendingDown} tone="text-danger" label="Estimated annual loss from delays" value={eur(result.annualLoss)} />
              <Metric icon={Clock} tone="text-warning" label="Manual monitoring hours saved per year" value={`${result.hours.toLocaleString()} hrs`} />
              <div className="rounded-2xl border border-accent bg-accent-soft/60 p-7">
                <div className="flex items-center gap-2 text-accent">
                  <PiggyBank className="size-5" aria-hidden />
                  <span className="text-small font-semibold uppercase tracking-wide">Potential annual saving</span>
                </div>
                <p className="mt-2 text-display font-extrabold tracking-tight text-ink">{eur(result.saving)}</p>
                <p className="mt-1 text-small text-ink-soft">
                  After the €6,600/yr Pro plan, from a conservative 60% cut in delay costs.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

function Metric({
  icon: Icon,
  tone,
  label,
  value,
}: {
  icon: typeof Clock;
  tone: string;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-raised p-7">
      <div className={`flex items-center gap-2 ${tone}`}>
        <Icon className="size-5" aria-hidden />
        <span className="text-small font-medium text-ink-soft">{label}</span>
      </div>
      <p className="mt-2 text-h1 font-extrabold tracking-tight text-ink">{value}</p>
    </div>
  );
}
