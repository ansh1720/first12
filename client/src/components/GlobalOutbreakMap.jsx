import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import axios from 'axios';

export default function GlobalOutbreakMap() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('/api/outbreaks').then(res => {
      setData(res.data
        .filter(d => d.LatestValue && d.GeoAreaName)
        .map(d => ({ country: d.GeoAreaName,
            value: +d.LatestValue,
            coords: [parseFloat(d.COUNTRYLat), parseFloat(d.COUNTRYLong)]
          }))
      );
    });
  }, []);

  return (
    <MapContainer center={[20,0]} zoom={2} style={{ height: 400, width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {data.map((d,i) => (
        <Circle
          key={i}
          center={d.coords}
          radius={Math.sqrt(d.value)*1000}
          fillColor="red"
          color="red"
          fillOpacity={0.4}
        >
          <Popup>
            <strong>{d.country}</strong><br />
            Cases per 100k: {d.value}
          </Popup>
        </Circle>
      ))}
    </MapContainer>
  );
}
