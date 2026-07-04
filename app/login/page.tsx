import { Suspense } from 'react';
import type { Metadata } from 'next';

import { LoginScreen } from '@/screens/LoginScreen';

export const metadata: Metadata = {
  title: 'Log in',
  robots: { index: false, follow: false },
};

export default function Page() {
  // LoginScreen reads useSearchParams (redirect + oauth error), which requires a
  // Suspense boundary during static generation.
  return (
    <Suspense>
      <LoginScreen />
    </Suspense>
  );
}
