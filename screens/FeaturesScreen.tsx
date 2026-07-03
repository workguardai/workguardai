import { MarketingShell } from '@/components/marketing/MarketingShell';
import { PageHero } from '@/components/marketing/PageHero';
import { FeaturesSection } from '@/components/marketing/FeaturesSection';
import { DashboardShowcaseSection } from '@/components/marketing/DashboardShowcaseSection';
import { FinalCtaSection } from '@/components/marketing/FinalCtaSection';

export function FeaturesScreen() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Features"
        title="Construction site monitoring features, grouped by the work they do."
        subtitle="Planning, monitoring, prediction, and alerting, built for teams running complex multi-site work under real deadlines."
      />
      <FeaturesSection />
      <DashboardShowcaseSection />
      <FinalCtaSection />
    </MarketingShell>
  );
}
