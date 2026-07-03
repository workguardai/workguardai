import type { Metadata } from 'next';

import { ContactScreen } from '@/screens/ContactScreen';

export const metadata: Metadata = {
  title: 'Request access',
  description:
    'Request early access to WorkGuard AI and start a free pilot on one of your construction sites, with personal onboarding from the team.',
};

export default function Page() {
  return <ContactScreen />;
}
