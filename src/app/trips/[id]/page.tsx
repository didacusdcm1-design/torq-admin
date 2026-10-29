export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import TripDetailsClient from './TripDetailsClient';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function TripDetailsPage() {
  return (
    <DashboardLayout>
      <Suspense fallback={<div className="p-10 text-center">Loading trip details...</div>}>
        <TripDetailsClient />
      </Suspense>
    </DashboardLayout>
  );
}