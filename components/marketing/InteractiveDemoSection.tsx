'use client';

/**
 * Interactive demo — a scripted simulation of the product pipeline (no backend).
 * Auto-plays through phases when scrolled into view, loops, and can be replayed.
 * Static final frame under reduced-motion. Motion here is storytelling: it walks
 * the buyer through upload -> parse -> reason -> risk -> dashboard.
 */
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import { FileUp, ScanSearch, Cpu, TriangleAlert, LayoutDashboard, RotateCcw } from 'lucide-react';

import { cn } from '@/lib/cn';
import { Container } from './Container';
import { Reveal } from './Reveal';

const PHASES = [
  { icon: FileUp, label: 'Upload drawing', caption: 'Harbour-Yard-L2.dwg received' },
  { icon: ScanSearch, label: 'Parse the plan', caption: 'Reading zones, walls, and dimensions' },
  { icon: Cpu, label: 'Reason over the model', caption: 'Inferring milestones and dependencies' },
  { icon: TriangleAlert, label: 'Detect risk', caption: 'Zone C excavation trailing plan' },
  { icon: LayoutDashboard, label: 'Generate dashboard', caption: 'Live progress ready to review' },
];

const PHASE_MS = 1900;

export function InteractiveDemoSection() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const [rawPhase, setPhase] = useState(0);
  // Under reduced motion, always show the final frame without driving state.
  const phase = reduce ? PHASES.length - 1 : rawPhase;

  useEffect(() => {
    if (reduce || !inView) return;
    const id = setInterval(() => setPhase((p) => (p + 1) % PHASES.length), PHASE_MS);
    return () => clearInterval(id);
  }, [inView, reduce]);

  return (
    <section id="demo" className="border-t border-line/60 py-24">
      <Container>
        <div ref={ref} className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div>
              <p className="text-small font-semibold uppercase tracking-wide text-accent">Live demo</p>
              <h2 className="mt-3 text-h2 font-bold text-ink">Watch a plan become a dashboard.</h2>
              <p className="mt-4 max-w-xl text-body-lg text-ink-soft">
                This is the exact path your drawing takes inside WorkGuard AI, from the moment you
                upload it to the moment your team sees where every site stands.
              </p>

              <ol className="mt-8 flex flex-col gap-2">
                {PHASES.map((p, i) => {
                  const active = i === phase;
                  const done = i < phase;
                  return (
                    <li
                      key={p.label}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors',
                        active ? 'bg-accent-soft' : 'bg-transparent',
                      )}
                    >
                      <span
                        className={cn(
                          'grid size-8 shrink-0 place-items-center rounded-lg border',
                          active
                            ? 'border-accent bg-accent text-accent-ink'
                            : done
                              ? 'border-accent/30 bg-accent-soft text-accent'
                              : 'border-line bg-raised text-ink-muted',
                        )}
                      >
                        <p.icon className="size-4" aria-hidden />
                      </span>
                      <span
                        className={cn(
                          'text-small font-medium',
                          active ? 'text-ink' : 'text-ink-soft',
                        )}
                      >
                        {p.label}
                      </span>
                      {!reduce && (
                        <button
                          type="button"
                          onClick={() => setPhase(0)}
                          className={cn(
                            'ml-auto text-ink-muted transition-colors hover:text-ink',
                            i === PHASES.length - 1 && active ? 'inline-flex' : 'hidden',
                          )}
                          aria-label="Replay demo"
                        >
                          <RotateCcw className="size-4" aria-hidden />
                        </button>
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <DemoStage phase={phase} reduce={!!reduce} />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

function DemoStage({ phase, reduce }: { phase: number; reduce: boolean }) {
  const current = PHASES[phase] ?? PHASES[0]!;
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-raised shadow-overlay">
      <div
        aria-hidden
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            'linear-gradient(var(--color-line) 1px, transparent 1px), linear-gradient(90deg, var(--color-line) 1px, transparent 1px)',
          backgroundSize: '34px 34px',
        }}
      />
      {/* Scanning sweep during parse/reason phases */}
      {!reduce && (phase === 1 || phase === 2) && (
        <motion.div
          className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-accent/20 to-transparent"
          initial={{ x: '-20%' }}
          animate={{ x: '120%' }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
        />
      )}

      <div className="absolute inset-0 grid place-items-center p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            initial={reduce ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35 }}
            className="w-full max-w-sm"
          >
            {phase <= 2 ? (
              <div className="rounded-xl border border-line bg-canvas/80 p-5 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-lg bg-accent text-accent-ink">
                    <current.icon className="size-5" aria-hidden />
                  </span>
                  <div>
                    <p className="text-small font-semibold text-ink">{current.label}</p>
                    <p className="text-caption text-ink-muted">{current.caption}</p>
                  </div>
                </div>
              </div>
            ) : phase === 3 ? (
              <div className="rounded-xl border border-danger/40 bg-danger-soft/70 p-5">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-lg bg-danger text-white">
                    <TriangleAlert className="size-5" aria-hidden />
                  </span>
                  <div>
                    <p className="text-small font-semibold text-ink">Risk detected</p>
                    <p className="text-caption text-ink-soft">{current.caption}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-line bg-canvas/90 p-5 backdrop-blur-sm">
                <p className="text-caption font-semibold uppercase tracking-wide text-ink-muted">
                  Site progress
                </p>
                <div className="mt-3 flex flex-col gap-3">
                  {[
                    { n: 'Harbour Yard', v: 67 },
                    { n: 'Rautatie Line 4', v: 41 },
                    { n: 'Kaisa Tower', v: 88 },
                  ].map((r) => (
                    <div key={r.n} className="flex items-center gap-3">
                      <span className="w-28 shrink-0 truncate text-caption text-ink-soft">{r.n}</span>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-sunken">
                        <div className="h-full rounded-full bg-ink" style={{ width: `${r.v}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
