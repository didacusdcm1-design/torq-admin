"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { api } from "@/lib/api";
import dynamic from "next/dynamic";

// 1. Dynamic imports for react-leaflet components (must be top level)
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });
const Polyline = dynamic(() => import('react-leaflet').then((mod) => mod.Polyline), { ssr: false });

export default function LiveMapPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [L, setL] = useState<any>(null);

  // 2. Only load Leaflet and its CSS when the component mounts in the browser
  useEffect(() => {
    import('leaflet').then((leaflet) => {
      require('leaflet/dist/leaflet.css');
      
      // Fix for missing marker icons
      const iconProto = leaflet.Icon.Default.prototype as any;
      delete iconProto._getIconUrl;
      leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      setL(leaflet);
      setIsMounted(true);
    });
  }, []);

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

  // Custom icons (only created after L is loaded)
  const pickupIcon = L ? new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
  }) : null;

  const dropoffIcon = L ? new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
  }) : null;

  const defaultCenter: [number, number] = [-1.286389, 36.817223];

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
          {!isMounted ? (
            <div className="flex items-center justify-center h-full text-gray-500">Loading map engine...</div>
          ) : isLoading ? (
            <div className="flex items-center justify-center h-full text-gray-500">Loading trip data...</div>
          ) : (
            <MapContainer center={defaultCenter} zoom={12} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              
              {activeTrips.map((trip: any) => (
                <div key={trip.id}>
                  <Marker position={[trip.pickupLat, trip.pickupLng]} icon={pickupIcon}>
                    <Popup>
                      <div className="font-semibold text-green-600">Pickup</div>
                      <div className="text-xs text-gray-500">Trip: {trip.id.substring(0,8)}</div>
                    </Popup>
                  </Marker>

                  <Marker position={[trip.dropoffLat, trip.dropoffLng]} icon={dropoffIcon}>
                    <Popup>
                      <div className="font-semibold text-red-600">Destination</div>
                      <div className="text-xs text-gray-500">Fare: KES {trip.estimatedFare}</div>
                    </Popup>
                  </Marker>

                  <Polyline 
                    positions={[[trip.pickupLat, trip.pickupLng], [trip.dropoffLat, trip.dropoffLng]]}
                    pathOptions={{ color: '#FCD34D', dashArray: '5, 10', weight: 3 }}
                  />
                </div>
              ))}
            </MapContainer>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}