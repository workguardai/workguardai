import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { cn } from '@/lib/cn';
import { buttonClasses } from '@/components/ui/buttonClasses';
import { Container } from './Container';
import { Reveal } from './Reveal';

export function FinalCtaSection() {
  return (
    <section className="py-24">
      <Container>
        <Reveal>
          <div className="overflow-hidden rounded-3xl bg-accent px-8 py-16 text-center sm:px-16">
            <h2 className="mx-auto max-w-2xl text-h2 font-extrabold text-accent-ink">
              Ready to see every site clearly?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-body-lg text-accent-ink/85">
              Start with a free pilot on one real project. Personal onboarding, no commitment.
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                href="/contact"
                className={cn(
                  buttonClasses({ variant: 'secondary', size: 'lg' }),
                  'border-transparent bg-canvas text-ink hover:bg-raised',
                )}
              >
                Request access
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
