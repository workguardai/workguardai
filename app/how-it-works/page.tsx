import type { Metadata } from 'next';

import { HowItWorksScreen } from '@/screens/HowItWorksScreen';

export const metadata: Metadata = {
  title: 'How construction progress tracking works',
  description:
    'See how WorkGuard AI turns a construction drawing into a live site model and tracks real progress against plan, step by step.',
};

export default function Page() {
  return <HowItWorksScreen />;
}
