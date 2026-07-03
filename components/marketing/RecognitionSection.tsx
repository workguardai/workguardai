import { Container } from './Container';
import { Reveal } from './Reveal';

const MILESTONES = [
  { date: 'Oct 2023', title: 'Founded in Finland', body: 'Started with one problem worth solving: manual site monitoring.' },
  { date: 'Apr 2024', title: 'Joined the NEXUS programme', body: 'Mentorship, network, and strategic support.' },
  { date: '2025', title: 'Won the Sisu Factory pitch', body: 'Selected by the Cities of Helsinki, Espoo and Vantaa for urban infrastructure monitoring.' },
  { date: 'Jun 2025', title: 'First funding and MVP', body: 'MVP live with ANK Construction as the first pilot partner.' },
  { date: 'Next', title: 'Rollout across Finland', body: 'Commercial launch and the IoT connectivity layer.' },
];

export function RecognitionSection() {
  return (
    <section className="border-t border-line/60 py-24">
      <Container>
        <Reveal className="max-w-2xl">
          <h2 className="text-h2 font-bold text-ink">Backed by the people who build the future.</h2>
          <p className="mt-4 text-body-lg text-ink-soft">
            From a first idea to a working platform with real pilots and public-sector recognition.
          </p>
        </Reveal>

        <ol className="mt-12 border-l border-line pl-8">
          {MILESTONES.map((m, i) => (
            <Reveal key={m.title} delay={i * 0.05}>
              <li className="relative pb-10 last:pb-0">
                <span
                  className="absolute -left-[41px] top-1 grid size-4 place-items-center rounded-full border-2 border-accent bg-canvas"
                  aria-hidden
                >
                  <span className="size-1.5 rounded-full bg-accent" />
                </span>
                <span className="font-mono text-caption text-ink-muted">{m.date}</span>
                <h3 className="mt-1 text-h4 font-semibold text-ink">{m.title}</h3>
                <p className="mt-1 max-w-xl text-body text-ink-soft">{m.body}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
