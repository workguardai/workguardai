import { MarketingShell } from '@/components/marketing/MarketingShell';
import { PageHero } from '@/components/marketing/PageHero';
import { PricingSection } from '@/components/marketing/PricingSection';
import { RoiCalculator } from '@/components/marketing/RoiCalculator';
import { FaqSection } from '@/components/marketing/FaqSection';
import { FinalCtaSection } from '@/components/marketing/FinalCtaSection';

export function PricingScreen() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Pricing"
        title="Pricing that starts free on a real site."
        subtitle="Run a full pilot on one project at no cost. Move up when WorkGuard is monitoring your whole portfolio."
      />
      <PricingSection />
      <RoiCalculator />
      <FaqSection />
      <FinalCtaSection />
    </MarketingShell>
  );
}
