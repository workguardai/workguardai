'use client';

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Plus } from 'lucide-react';

import { cn } from '@/lib/cn';
import { Container } from './Container';

const FAQS = [
  {
    q: 'What file types can I upload?',
    a: 'DWG and standard construction drawings today. Support for DXF, PDF, and BIM formats is on the roadmap.',
  },
  {
    q: 'How accurate is the progress tracking?',
    a: 'WorkGuard AI reports a confidence score with every estimate and separates what it observed from what it inferred, so you always know how sure it is.',
  },
  {
    q: 'Is my project data secure?',
    a: 'Yes. Data is isolated per organisation, access is role-based, and every action is recorded in an audit log.',
  },
  {
    q: 'How long does setup take?',
    a: 'Upload a drawing and you have a live model in minutes. Pilot customers are onboarded personally by the team.',
  },
  {
    q: 'What does the free pilot include?',
    a: 'One site, plan uploads, the dashboard, and AI notifications, with onboarding directly from the founder.',
  },
];

export function FaqSection() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(-1);

  return (
    <section className="bg-sunken/40 py-24">
      <Container className="max-w-3xl">
        <h2 className="text-h2 font-bold text-ink">Questions, answered.</h2>
        <div className="mt-10 divide-y divide-line border-y border-line">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-4 py-5 text-left"
                >
                  <span className="text-body-lg font-medium text-ink">{f.q}</span>
                  <Plus
                    className={cn(
                      'ml-auto size-5 shrink-0 text-ink-muted transition-transform',
                      isOpen && 'rotate-45',
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
                      <p className="max-w-2xl pb-6 text-body text-ink-soft">{f.a}</p>
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
