import { FileSpreadsheet, PhoneCall, CalendarClock, Clock3, ScanLine, LayoutGrid, BellRing, Waypoints } from 'lucide-react';

import { Container } from './Container';
import { Reveal } from './Reveal';

const OLD_WAY = [
  { icon: FileSpreadsheet, text: 'Spreadsheets and hand-written reports' },
  { icon: PhoneCall, text: 'Phone calls and one-off site visits' },
  { icon: CalendarClock, text: 'Weekly status meetings to find out where things stand' },
  { icon: Clock3, text: 'Updates that are already out of date' },
];

const NEW_WAY = [
  { icon: ScanLine, text: 'Progress read from your plan automatically' },
  { icon: LayoutGrid, text: 'Every site current, in one view' },
  { icon: BellRing, text: 'Delays flagged the moment they appear' },
  { icon: Waypoints, text: 'Managers freed from chasing updates' },
];

const STATS = [
  { value: '77%', label: 'of construction projects face costly delays' },
  { value: '€3.3M', label: 'lost every day, globally, to project delays' },
  { value: '80%', label: 'of sites run below their planned efficiency' },
];

export function ProblemSection() {
  return (
    <section className="border-t border-line/60 py-24">
      <Container>
        <Reveal className="max-w-2xl">
          <h2 className="text-h2 font-bold text-ink">
            Site reporting still runs on phone calls and spreadsheets.
          </h2>
          <p className="mt-4 text-body-lg text-ink-soft">
            Managers lose hours chasing updates that are stale the moment they arrive. Small slips go
            unseen until they turn into expensive delays.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-2xl border border-line bg-raised p-7">
              <h3 className="text-small font-semibold uppercase tracking-wide text-ink-muted">Today</h3>
              <ul className="mt-5 flex flex-col gap-4">
                {OLD_WAY.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-start gap-3 text-body text-ink-soft">
                    <Icon className="mt-0.5 size-5 shrink-0 text-ink-muted" aria-hidden />
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="h-full rounded-2xl border border-accent/30 bg-accent-soft/50 p-7">
              <h3 className="text-small font-semibold uppercase tracking-wide text-accent">
                With WorkGuard AI
              </h3>
              <ul className="mt-5 flex flex-col gap-4">
                {NEW_WAY.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-start gap-3 text-body text-ink">
                    <Icon className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden />
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <dl className="mt-14 grid gap-8 border-t border-line pt-10 sm:grid-cols-3">
            {STATS.map((stat) => (
              <div key={stat.value}>
                <dt className="text-h1 font-extrabold tracking-tight text-ink">{stat.value}</dt>
                <dd className="mt-2 text-small text-ink-soft">{stat.label}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-caption text-ink-muted">Industry estimates.</p>
        </Reveal>
      </Container>
    </section>
  );
}
