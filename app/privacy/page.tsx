import type { Metadata } from 'next';

import { PrivacyScreen } from '@/screens/PrivacyScreen';

export const metadata: Metadata = {
  title: 'Privacy policy',
  description: 'How WorkGuard AI collects, uses, stores, and protects your data.',
};

export default function Page() {
  return <PrivacyScreen />;
}
