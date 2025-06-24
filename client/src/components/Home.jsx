// src/components/Home.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Button,
  Divider
} from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';

function Home() {
  const [outbreakData, setOutbreakData] = useState([]);
  const [covidStats, setCovidStats] = useState(null);
  const [search, setSearch] = useState('');
  const [newsHeadlines, setNewsHeadlines] = useState([]);

  const countryCoords = {
    "SOUTH AFRICA": [-30.5595, 22.9375],
    "INDIA": [20.5937, 78.9629],
    "USA": [37.0902, -95.7129],
    "BRAZIL": [-14.235, -51.9253],
    "CHINA": [35.8617, 104.1954],
    "SPAIN": [40.4637, -3.7492],
  };

  useEffect(() => {
    axios.get('https://cms.who.int/api/hubs/diseaseoutbreaknews')
      .then(res => setOutbreakData(res.data?.items || []))
      .catch(console.error);

    axios.get('https://disease.sh/v3/covid-19/all')
      .then(res => setCovidStats(res.data))
      .catch(console.error);

    axios.get('http://localhost:5000/api/rss')
      .then(res => setNewsHeadlines(res.data))
      .catch(console.error);
  }, []);

  const filteredOutbreaks = outbreakData.filter(item =>
    item.Title?.toLowerCase().includes(search.toLowerCase()) ||
    item.Overview?.toLowerCase().includes(search.toLowerCase())
  );

  if (!covidStats) return <CircularProgress sx={{ mt: 4 }} />;

  return (
    <Box sx={{ px: 2 }}>
      <Typography variant="h4" gutterBottom>Home – Global Outbreaks & Health News</Typography>

      <TextField
        fullWidth
        placeholder="Search reported outbreaks or news"
        value={search}
        onChange={e => setSearch(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Typography variant="h6" sx={{ mb: 2 }}>
        🌍 COVID-19 Stats (Global): {covidStats.cases.toLocaleString()} cases, {covidStats.deaths.toLocaleString()} deaths
      </Typography>

      <MapContainer center={[20, 0]} zoom={2} style={{ height: 400, width: '100%', marginTop: 16 }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {filteredOutbreaks.map(item => {
          const matches = item.Overview?.toUpperCase().match(/\b[A-Z ]+\b/);
          const countryName = matches ? matches[0] : '';
          const coords = countryCoords[countryName];
          return coords ? (
            <Marker
              position={coords}
              key={item.DonId}
              icon={L.icon({
                iconUrl: 'https://cdn-icons-png.flaticon.com/512/2948/2948531.png',
                iconSize: [25, 25]
              })}
            >
              <Popup>
                <Typography variant="subtitle2">{item.Title}</Typography>
                <Typography variant="body2">
                  {item.PublicationDateAndTime?.split('T')[0]}
                </Typography>
                <Typography variant="body2">
                  {item.Overview?.substring(0, 100)}...
                </Typography>
                <Button
                  variant="outlined"
                  href={item.ItemDefaultUrl}
                  target="_blank"
                  sx={{ mt: 1 }}
                >
                  Read More
                </Button>
              </Popup>
            </Marker>
          ) : null;
        })}
      </MapContainer>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Latest WHO Outbreak Reports</Typography>
      <List>
        {filteredOutbreaks.slice(0, 6).map(item => (
          <ListItem key={item.DonId} divider>
            <ListItemText
              primary={item.Title}
              secondary={`${new Date(item.PublicationDateAndTime).toLocaleDateString()} – ${item.Overview?.substring(0, 100)}...`}
            />
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>🗞️ Global Health Headlines</Typography>
      <List>
        {newsHeadlines.map((item, i) => (
          <ListItem key={i} divider>
            <ListItemText
              primary={item.title}
              secondary={<a href={item.link} target="_blank" rel="noopener noreferrer">{item.link}</a>}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default Home;
