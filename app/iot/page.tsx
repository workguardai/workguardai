import type { Metadata } from 'next';

import { IoTScreen } from '@/screens/IoTScreen';

export const metadata: Metadata = {
  title: 'IoT connectivity for construction sites',
  description:
    'Connect sensors, cameras, and field devices so your construction sites report their own progress into the WorkGuard AI dashboard.',
};

export default function Page() {
  return <IoTScreen />;
}
