// components/DiseaseMap.js
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

const mockData = [
  { location: 'India', lat: 20.5937, lon: 78.9629, count: 523 },
  { location: 'USA', lat: 37.0902, lon: -95.7129, count: 1340 },
  { location: 'Brazil', lat: -14.2350, lon: -51.9253, count: 780 },
];

const DiseaseMap = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Use real API here later if available
    setData(mockData);
  }, []);

  return (
    <MapContainer center={[20, 0]} zoom={2} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {data.map((d, index) => (
        <CircleMarker
          key={index}
          center={[d.lat, d.lon]}
          radius={Math.log(d.count + 1) * 3}
          pathOptions={{ color: 'red', fillOpacity: 0.5 }}
        >
          <Tooltip>{`${d.location}: ${d.count} patients`}</Tooltip>
        </CircleMarker>
      ))}
    </MapContainer>
  );
};

export default DiseaseMap;
