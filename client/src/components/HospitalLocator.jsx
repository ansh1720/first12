// components/HospitalLocator.js
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import 'leaflet/dist/leaflet.css';

const getDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371e3;
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);
  const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c) / 1000;
};

function HospitalLocator({ selectedDisease }) {
  const [hospitals, setHospitals] = useState([]);
  const [position, setPosition] = useState([28.6139, 77.209]);
  const [diseaseFilter, setDiseaseFilter] = useState('');
  const [distanceFilter, setDistanceFilter] = useState(5000);
  const [typeFilter, setTypeFilter] = useState('all');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
        fetchHospitals(latitude, longitude);
      },
      () => {
        fetchHospitals(position[0], position[1]);
      }
    );
  }, []);

  const fetchHospitals = async (lat, lon) => {
    const query = `
      [out:json];
      (
        node["amenity"="hospital"](around:${distanceFilter},${lat},${lon});
        way["amenity"="hospital"](around:${distanceFilter},${lat},${lon});
        relation["amenity"="hospital"](around:${distanceFilter},${lat},${lon});
      );
      out center;
    `;

    try {
      const res = await axios.post('https://overpass-api.de/api/interpreter', query, {
        headers: { 'Content-Type': 'text/plain' },
      });
      const results = res.data.elements.map((el) => {
        const hLat = el.lat || el.center?.lat;
        const hLon = el.lon || el.center?.lon;
        return {
          id: el.id,
          name: el.tags?.name || 'Unnamed Hospital',
          lat: hLat,
          lon: hLon,
          distance: getDistance(lat, lon, hLat, hLon).toFixed(2),
          tags: el.tags || {},
        };
      });

      const filtered = results.filter((h) => {
        const matchDisease =
          diseaseFilter === '' ||
          h.name.toLowerCase().includes(diseaseFilter.toLowerCase()) ||
          h.tags?.speciality?.toLowerCase().includes(diseaseFilter.toLowerCase());

        const matchType =
          typeFilter === 'all' ||
          (h.tags?.["healthcare"]?.toLowerCase?.() || '').includes(typeFilter);

        return matchDisease && matchType;
      });

      filtered.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
      setHospitals(filtered);
    } catch (err) {
      console.error('Error fetching hospitals:', err);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Nearby Hospitals
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mb: 2,
          flexWrap: 'wrap',
        }}
      >
        <TextField
          label="Disease Filter"
          placeholder="e.g. Cardiology"
          value={diseaseFilter}
          onChange={(e) => setDiseaseFilter(e.target.value)}
          fullWidth
        />
        <TextField
          label="Distance (meters)"
          type="number"
          value={distanceFilter}
          onChange={(e) => setDistanceFilter(e.target.value)}
          fullWidth
        />
        <FormControl sx={{ minWidth: 160 }}>
          <InputLabel>Hospital Type</InputLabel>
          <Select
            value={typeFilter}
            label="Hospital Type"
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="clinic">Clinic</MenuItem>
            <MenuItem value="hospital">Hospital</MenuItem>
            <MenuItem value="specialist">Specialist</MenuItem>
            <MenuItem value="multispecialty">Multispecialty</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          onClick={() => fetchHospitals(position[0], position[1])}
        >
          Apply Filters
        </Button>
      </Box>

      <MapContainer center={position} zoom={13} style={{ height: '400px', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker
          position={position}
          icon={L.icon({
            iconUrl: 'https://cdn-icons-png.flaticon.com/512/149/149060.png',
            iconSize: [32, 32],
          })}
        >
          <Popup>You are here</Popup>
        </Marker>
        {hospitals.map((hospital) => (
          <Marker
            key={hospital.id}
            position={[hospital.lat, hospital.lon]}
            icon={L.icon({
              iconUrl: 'https://cdn-icons-png.flaticon.com/512/2991/2991221.png',
              iconSize: [32, 32],
            })}
          >
            <Popup>
              <strong>{hospital.name}</strong>
              <br />
              Distance: {hospital.distance} km
              <br />
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.lat},${hospital.lon}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Directions
              </a>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
}

export default HospitalLocator;
