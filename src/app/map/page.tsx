"use client";

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { api } from "@/lib/api";

// --- MAP COMPONENT (Client Only) ---
const MapComponent = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
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

  // Dynamically import Leaflet components
  const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
  const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
  const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
  const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });
  const Polyline = dynamic(() => import('react-leaflet').then((mod) => mod.Polyline), { ssr: false });

  // Load Leaflet CSS and fix icons safely on client side
  if (!isMounted) return <div className="p-10 text-center text-gray-500">Loading map...</div>;

  // Import L directly here since we are client-side mounted
  const L = require('leaflet');
  require('leaflet/dist/leaflet.css');

  // Fix missing default icons
  const iconProto = L.Icon.Default.prototype as any;
  delete iconProto._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });

  const pickupIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
  });

  const dropoffIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
  });

  const defaultCenter: [number, number] = [-1.286389, 36.817223];

  return (
    <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden relative z-0 h-full">
      {isLoading ? (
        <div className="flex items-center justify-center h-full text-gray-500">Loading map data...</div>
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
  );
};

// --- MAIN PAGE WRAPPER ---
export default function LiveMapPage() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Live Operations Map</h1>
            <p className="text-sm text-gray-500">Real-time view of active trips and rider locations.</p>
          </div>
        </div>

        {/* Wrap in Suspense to prevent prerender crashes */}
        <Suspense fallback={<div className="flex items-center justify-center h-full text-gray-500">Initializing map engine...</div>}>
          <MapComponent />
        </Suspense>
      </div>
    </DashboardLayout>
  );
}