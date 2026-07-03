import Link from 'next/link';
import { Mail } from 'lucide-react';

import { Container } from './Container';
import { NewsletterForm } from './NewsletterForm';

const COLUMNS = [
  {
    heading: 'Product',
    links: [
      { label: 'How it works', href: '/how-it-works' },
      { label: 'Features', href: '/features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'IoT', href: '/iot' },
      { label: 'Demo', href: '/demo' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-raised">
      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight text-ink">
              <span
                className="grid size-7 place-items-center rounded-md bg-accent text-caption font-bold text-accent-ink"
                aria-hidden
              >
                W
              </span>
              WorkGuard&nbsp;AI
            </Link>
            <p className="mt-4 max-w-xs text-small text-ink-soft">
              AI monitoring for smarter site management, from groundwork to dashboard.
            </p>
            <a
              href="mailto:ek@workguardai.com"
              className="mt-4 inline-flex items-center gap-2 text-small text-ink-soft transition-colors hover:text-ink"
            >
              <Mail className="size-4" aria-hidden />
              ek@workguardai.com
            </a>
            <div className="mt-4 flex gap-2">
              <a
                href="https://www.linkedin.com/company/workguardai"
                className="rounded-md border border-line px-3 py-1.5 text-small text-ink-soft transition-colors hover:text-ink"
              >
                LinkedIn
              </a>
              <a
                href="https://www.instagram.com/workguardai/"
                className="rounded-md border border-line px-3 py-1.5 text-small text-ink-soft transition-colors hover:text-ink"
              >
                Instagram
              </a>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.heading} className="lg:col-span-2">
              <h3 className="text-small font-semibold text-ink">{col.heading}</h3>
              <ul className="mt-4 flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-small text-ink-soft transition-colors hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="lg:col-span-2">
            <NewsletterForm />
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-line pt-8 text-caption text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 WorkGuard AI. Helsinki, Finland.</p>
          <p>Supported by LUT University, Helsinki Incubators, and Interreg EU.</p>
        </div>
      </Container>
    </footer>
  );
}
