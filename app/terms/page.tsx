import type { Metadata } from 'next';

import { TermsScreen } from '@/screens/TermsScreen';

export const metadata: Metadata = {
  title: 'Terms of service',
  description: 'The terms that govern use of the WorkGuard AI platform.',
};

export default function Page() {
  return <TermsScreen />;
}
