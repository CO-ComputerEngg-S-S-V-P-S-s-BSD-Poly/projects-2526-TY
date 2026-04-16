import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin } from 'lucide-react';

// Leaflet default marker icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LocationPicker = ({ onLocationSelect }) => {

  // ✅ Default location Dhule
  const [position, setPosition] = useState([20.9042, 74.7749]);

  function LocationMarker() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        onLocationSelect(lat, lng);
      },
    });

    return <Marker position={position}></Marker>;
  }

  return (
    <div
      className="map-container-wrapper"
      style={{
        height: '300px',
        width: '100%',
        borderRadius: '12px',
        overflow: 'hidden',
        marginTop: '10px',
        border: '2px solid var(--border-color)'
      }}
    >
      <div
        style={{
          position: 'absolute',
          zIndex: 1000,
          background: 'white',
          padding: '5px 10px',
          margin: '10px',
          borderRadius: '5px',
          fontSize: '0.8rem',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          color: '#333'
        }}
      >
        <MapPin size={14} style={{ verticalAlign: 'middle' }} /> Click on map to pick location
      </div>

      <MapContainer
        center={position}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        <LocationMarker />
      </MapContainer>
    </div>
  );
};

export default LocationPicker;
