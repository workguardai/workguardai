import Link from 'next/link';
import { Check, Lock } from 'lucide-react';

import { cn } from '@/lib/cn';
import { buttonClasses } from '@/components/ui/buttonClasses';
import { Container } from './Container';
import { Reveal } from './Reveal';

interface Feature {
  text: string;
  locked?: boolean;
}

interface Tier {
  name: string;
  price: string;
  period: string;
  blurb: string;
  cta: string;
  highlighted?: boolean;
  features: Feature[];
}

const TIERS: Tier[] = [
  {
    name: 'Pilot',
    price: 'Free',
    period: 'one site',
    blurb: 'Explore the platform on a real project.',
    cta: 'Apply for pilot',
    features: [
      { text: 'One site, plan uploads' },
      { text: 'Dashboard access' },
      { text: 'Basic AI notifications' },
      { text: 'Personal onboarding from the founder' },
      { text: 'Unlimited sites', locked: true },
      { text: 'Delay prediction and risk scoring', locked: true },
    ],
  },
  {
    name: 'Pro',
    price: '€550',
    period: 'per month',
    blurb: 'Full monitoring across every site you run.',
    cta: 'Get started',
    highlighted: true,
    features: [
      { text: 'Unlimited sites' },
      { text: 'Full plan parsing' },
      { text: 'Real-time AI monitoring' },
      { text: 'Delay prediction and risk scoring' },
      { text: 'Multi-user access' },
      { text: 'Priority support' },
    ],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'talk to us',
    blurb: 'For portfolios, integrations, and IoT.',
    cta: 'Contact sales',
    features: [
      { text: 'Everything in Pro' },
      { text: 'IoT connectivity bundle' },
      { text: 'Custom integrations' },
      { text: 'Dedicated account manager' },
      { text: 'On-site onboarding' },
      { text: 'SLA guarantee' },
    ],
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="border-t border-line/60 py-24">
      <Container>
        <Reveal className="max-w-2xl">
          <h2 className="text-h2 font-bold text-ink">Simple, honest pricing.</h2>
          <p className="mt-4 text-body-lg text-ink-soft">
            Start free on one site. Move up when WorkGuard is running your whole portfolio.
          </p>
        </Reveal>

        <div className="mt-12 grid items-start gap-6 lg:grid-cols-3">
          {TIERS.map((tier, i) => (
            <Reveal key={tier.name} delay={i * 0.06}>
              <div
                className={cn(
                  'flex h-full flex-col rounded-2xl border p-7',
                  tier.highlighted
                    ? 'border-accent bg-raised shadow-raised ring-1 ring-accent/20'
                    : 'border-line bg-raised',
                )}
              >
                <div className="flex items-center gap-3">
                  <h3 className="text-h4 font-semibold text-ink">{tier.name}</h3>
                  {tier.highlighted ? (
                    <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-caption font-medium text-accent">
                      Most popular
                    </span>
                  ) : null}
                </div>
                <p className="mt-4 flex items-baseline gap-2">
                  <span className="text-h1 font-extrabold tracking-tight text-ink">{tier.price}</span>
                  <span className="text-small text-ink-muted">{tier.period}</span>
                </p>
                <p className="mt-2 text-small text-ink-soft">{tier.blurb}</p>

                <ul className="mt-6 flex flex-1 flex-col gap-3">
                  {tier.features.map((f) => (
                    <li
                      key={f.text}
                      className={cn(
                        'flex items-start gap-2.5 text-small',
                        f.locked ? 'text-ink-muted' : 'text-ink-soft',
                      )}
                    >
                      {f.locked ? (
                        <Lock className="mt-0.5 size-4 shrink-0 text-ink-muted" aria-hidden />
                      ) : (
                        <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                      )}
                      <span className={cn(f.locked && 'line-through decoration-line-strong')}>
                        {f.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/contact"
                  className={cn(
                    'mt-8',
                    buttonClasses({ variant: tier.highlighted ? 'primary' : 'secondary', size: 'md' }),
                    'w-full',
                  )}
                >
                  {tier.cta}
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
