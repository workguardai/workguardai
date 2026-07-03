'use client';

/**
 * Features grouped by workflow, as an accordion (one open at a time). Avoids the
 * generic three-equal-cards feature row; each workflow expands to its
 * capabilities with a maturity tag.
 */
import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/cn';
import { Container } from './Container';

type Status = 'Live' | 'Coming' | 'Roadmap';

const STATUS_STYLE: Record<Status, string> = {
  Live: 'bg-success-soft text-success',
  Coming: 'bg-info-soft text-info',
  Roadmap: 'bg-sunken text-ink-muted',
};

const WORKFLOWS: { title: string; status: Status; items: string[] }[] = [
  { title: 'Planning', status: 'Live', items: ['Parse DWG and plan files', 'Build a digital site model from the drawing'] },
  { title: 'Monitoring', status: 'Live', items: ['Real-time progress against plan', 'Every site in one multi-site dashboard'] },
  { title: 'Prediction', status: 'Live', items: ['Delay prediction with confidence', 'Risk scoring and completion forecasts'] },
  { title: 'Alerting', status: 'Live', items: ['Smart alerts on deviations', 'Milestone and slippage notifications'] },
  { title: 'Connectivity', status: 'Coming', items: ['On-site sensors and cameras over LTE-M', 'Field data feeding your dashboard'] },
  { title: 'Integrations', status: 'Roadmap', items: ['Connect existing project and ERP tools', 'Fit WorkGuard into your current workflow'] },
];

export function FeaturesSection() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(0);

  return (
    <section id="features" className="border-t border-line/60 py-24">
      <Container className="max-w-3xl">
        <h2 className="text-h2 font-bold text-ink">Everything your team needs to stay ahead.</h2>
        <p className="mt-4 text-body-lg text-ink-soft">
          Built for construction and infrastructure teams running complex, multi-site work under
          real deadlines.
        </p>

        <div className="mt-10 divide-y divide-line border-y border-line">
          {WORKFLOWS.map((w, i) => {
            const isOpen = open === i;
            return (
              <div key={w.title}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-4 py-5 text-left"
                >
                  <span className="text-h4 font-semibold text-ink">{w.title}</span>
                  <span
                    className={cn(
                      'rounded-full px-2.5 py-0.5 text-caption font-medium',
                      STATUS_STYLE[w.status],
                    )}
                  >
                    {w.status}
                  </span>
                  <ChevronDown
                    className={cn(
                      'ml-auto size-5 shrink-0 text-ink-muted transition-transform',
                      isOpen && 'rotate-180',
                    )}
                    aria-hidden
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      initial={reduce ? false : { height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={reduce ? undefined : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: 'easeOut' }}
                      className="overflow-hidden"
                    >
                      <ul className="flex flex-col gap-2 pb-6">
                        {w.items.map((item) => (
                          <li key={item} className="flex items-start gap-2.5 text-body text-ink-soft">
                            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
