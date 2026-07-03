import { MarketingShell } from '@/components/marketing/MarketingShell';
import { PageHero } from '@/components/marketing/PageHero';
import { HowItWorksSection } from '@/components/marketing/HowItWorksSection';
import { InteractiveDemoSection } from '@/components/marketing/InteractiveDemoSection';
import { AIIntelligenceSection } from '@/components/marketing/AIIntelligenceSection';
import { FinalCtaSection } from '@/components/marketing/FinalCtaSection';

export function HowItWorksScreen() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="How it works"
        title="How WorkGuard AI tracks construction progress."
        subtitle="Upload a drawing once. The platform reads it, models the site, and tracks real progress against plan, then tells you what needs attention."
      />
      <HowItWorksSection />
      <InteractiveDemoSection />
      <AIIntelligenceSection />
      <FinalCtaSection />
    </MarketingShell>
  );
}
