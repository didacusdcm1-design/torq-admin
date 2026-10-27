"use client";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet icons missing in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const customIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MapComponent({ trips }: { trips: any[] }) {
    const center: [number, number] = [-1.2864, 36.8172]; // Nairobi

    return (
        <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%', zIndex: 0 }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {trips?.map((trip: any, idx) => (
                <Marker key={`pickup-${idx}`} position={[trip.pickupLat, trip.pickupLng]} icon={customIcon}>
                    <Popup>
                        <b>Trip #{trip.id.substring(0, 8)}</b><br/>
                        Status: {trip.status}<br/>
                        Customer: {trip.customer?.email}<br/>
                        Fare: KSh {trip.estimatedFare}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}