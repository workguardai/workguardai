'use client';

/**
 * Hero — asymmetric split: value proposition + primary CTA on the left, a live
 * animated product preview on the right, over a faint blueprint grid (CAD motif).
 * Fits the viewport; max 3 text elements; one primary + one secondary CTA.
 */
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

import { buttonClasses } from '@/components/ui/buttonClasses';
import { HeroDashboard } from './HeroDashboard';

const EASE = [0.16, 1, 0.3, 1] as const;

export function HeroSection() {
  const reduce = useReducedMotion();
  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay, ease: EASE },
        };

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(var(--color-line) 1px, transparent 1px), linear-gradient(90deg, var(--color-line) 1px, transparent 1px)',
          backgroundSize: '52px 52px',
          maskImage: 'radial-gradient(115% 80% at 72% 0%, black, transparent 68%)',
          WebkitMaskImage: 'radial-gradient(115% 80% at 72% 0%, black, transparent 68%)',
          opacity: 0.55,
        }}
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 pb-24 pt-16 lg:grid-cols-12 lg:gap-10 lg:pt-24">
        <div className="lg:col-span-6">
          <motion.h1 {...rise(0)} className="text-display font-extrabold text-ink">
            See real progress on every construction site.
          </motion.h1>
          <motion.p {...rise(0.08)} className="mt-6 max-w-xl text-body-lg text-ink-soft">
            WorkGuard AI reads your drawings, builds a live model of the site, and tracks real
            progress against plan. Automatically.
          </motion.p>
          <motion.div {...rise(0.16)} className="mt-9 flex flex-wrap gap-3">
            <Link href="/contact" className={buttonClasses({ size: 'lg' })}>
              Request access
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link href="/how-it-works" className={buttonClasses({ variant: 'secondary', size: 'lg' })}>
              See how it works
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          className="lg:col-span-6"
        >
          <HeroDashboard />
        </motion.div>
      </div>
    </section>
  );
}
