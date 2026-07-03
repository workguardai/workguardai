import { FileText, ScanSearch, Waypoints, Cpu, ShieldAlert, Lightbulb } from 'lucide-react';

import { Container } from './Container';
import { Reveal } from './Reveal';

const NODES = [
  { icon: FileText, label: 'Drawing' },
  { icon: ScanSearch, label: 'Parser' },
  { icon: Waypoints, label: 'Site graph' },
  { icon: Cpu, label: 'Inference' },
  { icon: ShieldAlert, label: 'Risk engine' },
  { icon: Lightbulb, label: 'Recommendations' },
];

const OUTPUTS = ['Deviation detection', 'Delay prediction', 'Risk scoring', 'Milestone tracking'];

export function AIIntelligenceSection() {
  return (
    <section className="border-t border-line/60 py-24">
      <Container>
        <Reveal className="max-w-2xl">
          <p className="text-small font-semibold uppercase tracking-wide text-accent">The intelligence</p>
          <h2 className="mt-3 text-h2 font-bold text-ink">
            Not a chatbot. An engineering model of your site.
          </h2>
          <p className="mt-4 text-body-lg text-ink-soft">
            WorkGuard AI reads a drawing the way an engineer would, builds a structured model, then
            reasons over it to find what is slipping and why.
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="relative mt-14">
            <div className="absolute inset-x-6 top-6 hidden h-px bg-line md:block" aria-hidden />
            <div className="relative grid grid-cols-2 gap-y-10 sm:grid-cols-3 md:flex md:justify-between">
              {NODES.map((node) => (
                <div key={node.label} className="flex flex-col items-center gap-3 text-center md:w-32">
                  <span className="grid size-12 place-items-center rounded-xl border border-line bg-raised text-accent shadow-subtle">
                    <node.icon className="size-5" aria-hidden />
                  </span>
                  <span className="text-small font-medium text-ink">{node.label}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="mt-12 flex flex-wrap items-center gap-3">
            <span className="text-small text-ink-muted">It produces:</span>
            {OUTPUTS.map((o) => (
              <span
                key={o}
                className="rounded-full border border-line bg-raised px-3 py-1.5 text-small font-medium text-ink-soft"
              >
                {o}
              </span>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
