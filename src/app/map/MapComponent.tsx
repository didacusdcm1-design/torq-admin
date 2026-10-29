"use client";

import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for missing marker icons
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

export default function MapComponent({ activeTrips }: { activeTrips: any[] }) {
  const defaultCenter: [number, number] = [-1.286389, 36.817223];

  return (
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
  );
}