// components/DiseasePredictor.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  Stack,
  useMediaQuery,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';

const DiseasePredictor = () => {
  const [symptoms, setSymptoms] = useState([]);
  const [allSymptoms, setAllSymptoms] = useState([]);
  const [predictedDisease, setPredictedDisease] = useState(null);
  const [diseaseMatches, setDiseaseMatches] = useState([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    axios.get('http://localhost:5000/api/diseases')
      .then(res => {
        const all = res.data.flatMap(d => d.symptoms || []);
        setAllSymptoms([...new Set(all)].sort());
      });
  }, []);

  const handlePredict = async () => {
    const res = await axios.get('http://localhost:5000/api/diseases');
    const diseases = res.data;

    const scores = diseases.map(d => {
      const matchCount = d.symptoms?.filter(sym => symptoms.includes(sym)).length || 0;
      return { name: d.name, score: matchCount };
    }).filter(d => d.score > 0);

    scores.sort((a, b) => b.score - a.score);
    setDiseaseMatches(scores);
    setPredictedDisease(scores[0]?.name || 'No Match Found');
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: { xs: 2, sm: 3 } }}>
      <Typography variant="h5" gutterBottom>🧠 Disease Predictor</Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        Select or type symptoms you're experiencing. We'll match them with known diseases.
      </Typography>

      <Autocomplete
        multiple
        options={allSymptoms}
        value={symptoms}
        onChange={(e, newVal) => setSymptoms(newVal)}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip variant="outlined" label={option} {...getTagProps({ index })} />
          ))
        }
        renderInput={(params) => (
          <TextField {...params} label="Symptoms" placeholder="Start typing..." fullWidth />
        )}
        sx={{ mb: 2 }}
      />

      <Button
        variant="contained"
        fullWidth={isMobile}
        onClick={handlePredict}
        disabled={symptoms.length === 0}
      >
        Predict Disease
      </Button>

      {predictedDisease && (
        <Box mt={3}>
          <Typography variant="h6">Most Likely Disease:</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>{predictedDisease}</Typography>

          <Typography variant="subtitle1">Top Matches:</Typography>
          <Stack spacing={1} mt={1}>
            {diseaseMatches.map((d, idx) => (
              <Box key={idx}>
                <Chip label={`${d.name} (${d.score} matched)`} color={idx === 0 ? 'primary' : 'default'} />
              </Box>
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default DiseasePredictor;
