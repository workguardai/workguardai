import type { Metadata } from 'next';

import { HomeScreen } from '@/screens/HomeScreen';

export const metadata: Metadata = {
  title: 'AI construction site monitoring & progress tracking',
  description:
    'Turn your construction drawings into a live site model and track real progress against plan automatically. Catch delays before they cost you.',
};

export default function Home() {
  return <HomeScreen />;
}
