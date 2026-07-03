import { SiteHeader } from '@/components/marketing/SiteHeader';
import { HeroSection } from '@/components/marketing/HeroSection';
import { ProblemSection } from '@/components/marketing/ProblemSection';
import { HowItWorksSection } from '@/components/marketing/HowItWorksSection';
import { InteractiveDemoSection } from '@/components/marketing/InteractiveDemoSection';
import { AIIntelligenceSection } from '@/components/marketing/AIIntelligenceSection';
import { DashboardShowcaseSection } from '@/components/marketing/DashboardShowcaseSection';
import { FeaturesSection } from '@/components/marketing/FeaturesSection';
import { IoTSection } from '@/components/marketing/IoTSection';
import { RecognitionSection } from '@/components/marketing/RecognitionSection';
import { PricingSection } from '@/components/marketing/PricingSection';
import { FaqSection } from '@/components/marketing/FaqSection';
import { FinalCtaSection } from '@/components/marketing/FinalCtaSection';
import { SiteFooter } from '@/components/marketing/SiteFooter';

/** HomeScreen — the marketing landing page composition. */
export function HomeScreen() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection />
        <ProblemSection />
        <HowItWorksSection />
        <InteractiveDemoSection />
        <AIIntelligenceSection />
        <DashboardShowcaseSection />
        <FeaturesSection />
        <IoTSection />
        <RecognitionSection />
        <PricingSection />
        <FaqSection />
        <FinalCtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
