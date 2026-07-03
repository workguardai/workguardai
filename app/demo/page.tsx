import type { Metadata } from 'next';

import { DemoScreen } from '@/screens/DemoScreen';

export const metadata: Metadata = {
  title: 'Live demo',
  description:
    'Watch WorkGuard AI parse a construction drawing, model the site, detect risk, and generate a live progress dashboard.',
};

export default function Page() {
  return <DemoScreen />;
}
