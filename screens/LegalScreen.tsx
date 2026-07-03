import { MarketingShell } from '@/components/marketing/MarketingShell';
import { PageHero } from '@/components/marketing/PageHero';
import { Container } from '@/components/marketing/Container';

export interface LegalSection {
  heading: string;
  body: string;
}

export function LegalScreen({
  title,
  updated,
  sections,
}: {
  title: string;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <MarketingShell>
      <PageHero title={title} subtitle={`Last updated ${updated}.`} />
      <section className="py-20">
        <Container className="max-w-3xl">
          <div className="flex flex-col gap-10">
            {sections.map((s) => (
              <div key={s.heading}>
                <h2 className="text-h4 font-semibold text-ink">{s.heading}</h2>
                <p className="mt-3 text-body text-ink-soft">{s.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </MarketingShell>
  );
}
