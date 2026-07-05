import type { Metadata } from 'next';

import { OnboardingScreen } from '@/screens/OnboardingScreen';

export const metadata: Metadata = {
  title: 'Get started',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <OnboardingScreen />;
}
