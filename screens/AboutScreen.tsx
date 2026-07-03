import { MarketingShell } from '@/components/marketing/MarketingShell';
import { PageHero } from '@/components/marketing/PageHero';
import { Container } from '@/components/marketing/Container';
import { Reveal } from '@/components/marketing/Reveal';
import { RecognitionSection } from '@/components/marketing/RecognitionSection';
import { FinalCtaSection } from '@/components/marketing/FinalCtaSection';

const TEAM = [
  { name: 'Endrit Kola', role: 'Founder & CEO' },
  { name: 'Larissa Chaves', role: 'CTO' },
  { name: 'Pratham Srivastava', role: 'Full-stack Developer' },
  { name: 'Altin Kola', role: 'Field & Infrastructure Advisor' },
];

function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('');
}

export function AboutScreen() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="About"
        title="Construction runs the world. Its tools should keep up."
        subtitle="WorkGuard AI exists to take the manual burden off site managers and give infrastructure teams real-time visibility over every project."
      />

      <section className="border-b border-line/60 py-24">
        <Container className="grid gap-12 lg:grid-cols-2">
          <Reveal>
            <h2 className="text-h3 font-bold text-ink">Our mission</h2>
            <p className="mt-4 text-body-lg text-ink-soft">
              One of the world&apos;s largest industries still runs million-euro projects on
              spreadsheets, phone calls, and site visits. We think the people building the future
              deserve software that tells them the truth about their sites, continuously.
            </p>
            <p className="mt-4 text-body text-ink-soft">
              Founded in Finland in 2023, WorkGuard AI is a working platform with its first pilots
              underway, backed by LUT University, Helsinki incubators, and Interreg EU funding.
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="grid grid-cols-2 gap-4">
              {TEAM.map((m) => (
                <div key={m.name} className="rounded-2xl border border-line bg-raised p-5">
                  <span className="grid size-11 place-items-center rounded-full bg-accent-soft text-small font-bold text-accent">
                    {initials(m.name)}
                  </span>
                  <p className="mt-3 text-body font-semibold text-ink">{m.name}</p>
                  <p className="text-small text-ink-muted">{m.role}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      <RecognitionSection />
      <FinalCtaSection />
    </MarketingShell>
  );
}
