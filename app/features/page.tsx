import type { Metadata } from 'next';

import { FeaturesScreen } from '@/screens/FeaturesScreen';

export const metadata: Metadata = {
  title: 'Construction site monitoring features',
  description:
    'Plan parsing, real-time progress tracking, delay prediction, and smart alerts, built for multi-site construction and infrastructure teams.',
};

export default function Page() {
  return <FeaturesScreen />;
}
