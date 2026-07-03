import { MarketingShell } from '@/components/marketing/MarketingShell';
import { PageHero } from '@/components/marketing/PageHero';
import { InteractiveDemoSection } from '@/components/marketing/InteractiveDemoSection';
import { FinalCtaSection } from '@/components/marketing/FinalCtaSection';

export function DemoScreen() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Live demo"
        title="See a drawing become a live dashboard."
        subtitle="Watch the exact path your plan takes inside WorkGuard AI, from upload to a dashboard your team can act on."
      />
      <InteractiveDemoSection />
      <FinalCtaSection />
    </MarketingShell>
  );
}
