// DiseaseDetails.js (Updated to match capitalized DB keys and source metadata)
import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

ChartJS.register(ArcElement, Tooltip, Legend);

function DiseaseDetails({ disease, onClose }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const symptomData = {
    labels: disease.Symptoms || [],
    datasets: [
      {
        label: 'Symptom Distribution',
        data: (disease.Symptoms || []).map(() => 1),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#9CCC65', '#FF7043', '#BA68C8'
        ],
        borderWidth: 1
      }
    ]
  };

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        p: 3,
        borderRadius: 2,
        boxShadow: 3,
        mt: 3,
        maxWidth: 600,
        mx: 'auto',
      }}
    >
      <Button onClick={onClose} variant="contained" sx={{ mb: 2 }}>
        ← Back
      </Button>

      <Typography variant="h5" gutterBottom>{disease.name}</Typography>

      {disease.Cause && (
        <Typography variant="body1" sx={{ mt: 1 }}>
          <strong>Cause:</strong> {disease.Cause}
        </Typography>
      )}

      {disease.Prevention && (
        <Typography variant="body1" sx={{ mt: 1 }}>
          <strong>Prevention:</strong> {disease.Prevention}
        </Typography>
      )}

      {disease.Treatment && (
        <Typography variant="body1" sx={{ mt: 1 }}>
          <strong>Treatment:</strong> {disease.Treatment}
        </Typography>
      )}

      {disease.RiskFactors?.length > 0 && (
        <Typography variant="body1" gutterBottom sx={{ mt: 1 }}>
          <strong>Risk Factors:</strong> {disease.RiskFactors.join(', ')}
        </Typography>
      )}

      {disease.Symptoms?.length > 0 && (
        <>
          <Typography variant="h6" sx={{ mt: 2 }}>Symptoms</Typography>
          <List dense>
            {disease.Symptoms.map((symptom, index) => (
              <ListItem key={index}>{symptom}</ListItem>
            ))}
          </List>
          <Box sx={{ maxWidth: 400, mx: 'auto', mt: 3 }}>
            <Pie data={symptomData} />
          </Box>
        </>
      )}
      {disease.source?.name && disease.source?.url && (
        <Box mt={3} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <img
            src={`/source-logos/${disease.source.name.toLowerCase()}.png`}
            alt={disease.source.name}
            style={{ width: 24, height: 24 }}
          />
          <Typography variant="body2">
            <strong>Source:</strong>{' '}
            <a
              href={disease.source.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {disease.source.name}
            </a>
          </Typography>
        </Box>
      )}

      
    </Box>
  );
}

export default DiseaseDetails;
