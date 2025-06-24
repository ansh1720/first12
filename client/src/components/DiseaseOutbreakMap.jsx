import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const DiseaseOutbreakMap = () => {
  const [outbreaks, setOutbreaks] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/diseases')
      .then((res) => {
        // Assuming your diseases may contain outbreak location info like lat/lng
        const withLocation = res.data
          .filter(d => d.location && d.location.lat && d.location.lng);
        setOutbreaks(withLocation);
      });
  }, []);

  return (
    <MapContainer center={[20, 77]} zoom={4} style={{ height: '400px', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {outbreaks.map((disease, idx) => (
        <Marker
          key={idx}
          position={[disease.location.lat, disease.location.lng]}
          icon={L.icon({
            iconUrl: 'https://cdn-icons-png.flaticon.com/512/2983/2983846.png',
            iconSize: [32, 32],
          })}
        >
          <Popup>
            <strong>{disease.name}</strong><br />
            {disease.symptoms?.slice(0, 3).join(', ') || 'No symptoms listed'}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default DiseaseOutbreakMap;
