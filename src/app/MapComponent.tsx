"use client";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet icons missing in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function MapComponent() {
    const center: [number, number] = [-1.2864, 36.8172];
    const riders = [
        { pos: [-1.267, 36.810], name: 'John Kamau • On trip' },
        { pos: [-1.292, 36.821], name: 'Rider • Available' },
        { pos: [-1.278, 36.795], name: 'Rider • Available' },
        { pos: [-1.306, 36.830], name: 'Rider • On trip' },
        { pos: [-1.255, 36.840], name: 'Rider • Available' },
        { pos: [-1.285, 36.775], name: 'Rider • Available' }
    ] as { pos: [number, number], name: string }[];

    return (
        <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%', zIndex: 0 }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {riders.map((rider, idx) => (
                <Marker key={idx} position={rider.pos}>
                    <Popup>{rider.name}</Popup>
                </Marker>
            ))}
            <Polyline positions={[[-1.267, 36.810], [-1.278, 36.795], [-1.292, 36.821]]} color="#ffbd19" weight={4} />
        </MapContainer>
    );
}
