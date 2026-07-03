import { Clock, ShieldCheck, UserRound } from 'lucide-react';

import { MarketingShell } from '@/components/marketing/MarketingShell';
import { PageHero } from '@/components/marketing/PageHero';
import { Container } from '@/components/marketing/Container';
import { ContactForm } from '@/components/marketing/ContactForm';

const POINTS = [
  { icon: UserRound, text: 'Onboarded personally by the founding team' },
  { icon: Clock, text: 'A reply within one business day' },
  { icon: ShieldCheck, text: 'Your project details stay private' },
];

export function ContactScreen() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Request access"
        title="Start a free pilot on one of your sites."
        subtitle="Tell us about your project. We onboard a small number of pilot customers at a time, so we can set each one up properly."
      />
      <section className="py-20">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
          <aside className="lg:col-span-5">
            <div className="rounded-2xl border border-line bg-raised p-7">
              <h2 className="text-h4 font-semibold text-ink">What happens next</h2>
              <ul className="mt-5 flex flex-col gap-4">
                {POINTS.map((p) => (
                  <li key={p.text} className="flex items-start gap-3 text-body text-ink-soft">
                    <p.icon className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden />
                    {p.text}
                  </li>
                ))}
              </ul>
              <p className="mt-6 border-t border-line pt-5 text-small text-ink-muted">
                Prefer email? Reach the team at{' '}
                <a href="mailto:ek@workguardai.com" className="text-accent hover:underline">
                  ek@workguardai.com
                </a>
                .
              </p>
            </div>
          </aside>
        </Container>
      </section>
    </MarketingShell>
  );
}
