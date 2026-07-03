import { FileUp, ScanSearch, Building2, Activity, LayoutDashboard } from 'lucide-react';

import { Container } from './Container';
import { Reveal } from './Reveal';

const STEPS = [
  { icon: FileUp, title: 'Upload the drawing', body: 'Drop in a DWG or plan. Any site, any phase.' },
  { icon: ScanSearch, title: 'Read the plan', body: 'AI parses zones, dimensions, and milestones.' },
  { icon: Building2, title: 'Model the site', body: 'A live digital model of what should get built.' },
  { icon: Activity, title: 'Track against plan', body: 'Real progress compared to expected, continuously.' },
  { icon: LayoutDashboard, title: 'Flag what matters', body: 'Delays and risks surfaced in one dashboard.' },
];

export function HowItWorksSection() {
  return (
    <section id="how" className="bg-sunken/40 py-24">
      <Container>
        <Reveal className="max-w-2xl">
          <p className="text-small font-semibold uppercase tracking-wide text-accent">How it works</p>
          <h2 className="mt-3 text-h2 font-bold text-ink">From a drawing to a live site model.</h2>
          <p className="mt-4 text-body-lg text-ink-soft">
            Upload once. WorkGuard AI does the reading, the modelling, and the tracking, then tells
            you what needs attention.
          </p>
        </Reveal>

        <ol className="mt-14 grid gap-8 md:grid-cols-5">
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.06}>
              <li className="relative flex h-full flex-col">
                <div className="flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-xl border border-line bg-raised text-accent">
                    <step.icon className="size-5" aria-hidden />
                  </span>
                  <span className="font-mono text-caption text-ink-muted">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="mt-4 text-h4 font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 text-small text-ink-soft">{step.body}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
