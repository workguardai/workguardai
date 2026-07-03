import type { Metadata } from 'next';

import { PricingScreen } from '@/screens/PricingScreen';

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'WorkGuard AI pricing: start free with a full pilot on one site, then scale to unlimited sites on Pro or a custom Enterprise plan.',
};

export default function Page() {
  return <PricingScreen />;
}
