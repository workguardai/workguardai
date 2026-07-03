import { Container } from './Container';
import { Reveal } from './Reveal';

/** Compact hero for internal marketing pages: optional eyebrow, title, subtitle. */
export function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-line/60">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(var(--color-line) 1px, transparent 1px), linear-gradient(90deg, var(--color-line) 1px, transparent 1px)',
          backgroundSize: '52px 52px',
          maskImage: 'radial-gradient(100% 90% at 50% 0%, black, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(100% 90% at 50% 0%, black, transparent 70%)',
          opacity: 0.4,
        }}
      />
      <Container className="relative py-20">
        <Reveal className="max-w-3xl">
          {eyebrow ? (
            <p className="text-small font-semibold uppercase tracking-wide text-accent">{eyebrow}</p>
          ) : null}
          <h1 className="mt-3 text-h1 font-extrabold tracking-tight text-ink">{title}</h1>
          {subtitle ? <p className="mt-5 max-w-2xl text-body-lg text-ink-soft">{subtitle}</p> : null}
        </Reveal>
      </Container>
    </section>
  );
}
