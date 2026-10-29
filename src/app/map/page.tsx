"use client";

import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { api } from "@/lib/api";
import dynamic from "next/dynamic";

// Use dynamic import with ssr:false to ensure it ONLY loads in the browser
const MapComponent = dynamic(() => import('./MapComponent'), { 
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full text-gray-500">Loading map engine...</div>
});

export default function LiveMapPage() {
  const { data: tripsResponse, isLoading } = useQuery({
    queryKey: ["trips-map"],
    queryFn: async () => {
      const response = await api.get('/trips');
      return response.data;
    },
  });

  const activeTrips = Array.isArray(tripsResponse) 
    ? tripsResponse.filter((t: any) => ['REQUESTED', 'ACCEPTED', 'IN_PROGRESS'].includes(t.status))
    : [];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Live Operations Map</h1>
            <p className="text-sm text-gray-500">Real-time view of active trips and rider locations.</p>
          </div>
          <div className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg shadow-sm">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-medium text-gray-700">{activeTrips.length} Active Trips</span>
          </div>
        </div>

        <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden relative z-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-full text-gray-500">Loading trip data...</div>
          ) : (
            <MapComponent activeTrips={activeTrips} />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}