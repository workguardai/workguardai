import { MarketingShell } from '@/components/marketing/MarketingShell';
import { PageHero } from '@/components/marketing/PageHero';
import { IoTSection } from '@/components/marketing/IoTSection';
import { FinalCtaSection } from '@/components/marketing/FinalCtaSection';

export function IoTScreen() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Coming soon"
        title="IoT connectivity for construction sites."
        subtitle="Connect sensors, cameras, and field devices so your sites report their own progress, straight into the WorkGuard dashboard."
      />
      <IoTSection />
      <FinalCtaSection />
    </MarketingShell>
  );
}
