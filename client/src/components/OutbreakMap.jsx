// components/OutbreakMap.js
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const outbreakIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/619/619034.png',
  iconSize: [30, 30],
});

const OutbreakMap = () => {
  const [outbreaks, setOutbreaks] = useState([]);

  useEffect(() => {
    // You can replace this with API call to WHO or your backend
    const mockOutbreaks = [
      {
        id: 1,
        name: 'Dengue Fever',
        location: 'Delhi, India',
        lat: 28.6139,
        lon: 77.2090,
        cases: 1203,
      },
      {
        id: 2,
        name: 'Malaria',
        location: 'Kinshasa, DRC',
        lat: -4.4419,
        lon: 15.2663,
        cases: 947,
      },
      {
        id: 3,
        name: 'Cholera',
        location: 'Port-au-Prince, Haiti',
        lat: 18.5944,
        lon: -72.3074,
        cases: 511,
      },
    ];
    setOutbreaks(mockOutbreaks);
  }, []);

  return (
    <MapContainer center={[20, 0]} zoom={2} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {outbreaks.map((outbreak) => (
        <Marker
          key={outbreak.id}
          position={[outbreak.lat, outbreak.lon]}
          icon={outbreakIcon}
        >
          <Popup>
            <strong>{outbreak.name}</strong><br />
            Location: {outbreak.location}<br />
            Active cases: {outbreak.cases}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default OutbreakMap;
