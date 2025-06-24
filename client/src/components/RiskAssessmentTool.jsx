// RiskAssessmentTool.js
import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Slider,
  Alert,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

const symptomsList = [
  { name: 'Fever', weight: 2 },
  { name: 'Cough', weight: 1.5 },
  { name: 'Shortness of breath', weight: 3 },
  { name: 'Fatigue', weight: 1 },
  { name: 'Loss of taste/smell', weight: 2 },
];

const conditionsList = [
  { name: 'Diabetes', modifier: 1.2 },
  { name: 'Hypertension', modifier: 1.1 },
  { name: 'Heart Disease', modifier: 1.3 },
  { name: 'Respiratory Illness', modifier: 1.4 },
];

const getRiskLevel = (score) => {
  if (score < 5) return 'Low';
  if (score < 10) return 'Moderate';
  return 'High';
};

const RiskAssessmentTool = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [age, setAge] = useState(30);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [riskScore, setRiskScore] = useState(null);

  const handleSymptomChange = (event) => {
    const { value, checked } = event.target;
    setSelectedSymptoms((prev) =>
      checked ? [...prev, value] : prev.filter((s) => s !== value)
    );
  };

  const handleConditionChange = (event) => {
    const { value, checked } = event.target;
    setSelectedConditions((prev) =>
      checked ? [...prev, value] : prev.filter((c) => c !== value)
    );
  };

  const calculateRisk = () => {
    let baseScore = 0;

    selectedSymptoms.forEach((symptom) => {
      const item = symptomsList.find((s) => s.name === symptom);
      if (item) baseScore += item.weight;
    });

    const ageMultiplier = age < 40 ? 1 : age < 60 ? 1.2 : 1.5;
    baseScore *= ageMultiplier;

    let conditionMultiplier = 1;
    selectedConditions.forEach((condition) => {
      const cond = conditionsList.find((c) => c.name === condition);
      if (cond) conditionMultiplier *= cond.modifier;
    });

    const finalScore = +(baseScore * conditionMultiplier).toFixed(2);
    setRiskScore(finalScore);
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: 'auto',
        p: { xs: 2, sm: 3 },
        border: '1px solid #ccc',
        borderRadius: 2,
        mt: 3,
      }}
    >
      <Typography variant="h5" gutterBottom>
        Risk Assessment Tool
      </Typography>

      <Box mb={2}>
        <Typography gutterBottom>Age: {age}</Typography>
        <Slider
          value={age}
          onChange={(e, val) => setAge(val)}
          step={1}
          min={0}
          max={100}
          valueLabelDisplay="auto"
        />
      </Box>

      <Box mb={2}>
        <Typography variant="subtitle1">Symptoms</Typography>
        <FormGroup>
          {symptomsList.map((s) => (
            <FormControlLabel
              key={s.name}
              control={
                <Checkbox
                  value={s.name}
                  checked={selectedSymptoms.includes(s.name)}
                  onChange={handleSymptomChange}
                />
              }
              label={s.name}
            />
          ))}
        </FormGroup>
      </Box>

      <Box mb={2}>
        <Typography variant="subtitle1">Pre-existing Conditions</Typography>
        <FormGroup>
          {conditionsList.map((c) => (
            <FormControlLabel
              key={c.name}
              control={
                <Checkbox
                  value={c.name}
                  checked={selectedConditions.includes(c.name)}
                  onChange={handleConditionChange}
                />
              }
              label={c.name}
            />
          ))}
        </FormGroup>
      </Box>

      <Button variant="contained" fullWidth onClick={calculateRisk}>
        Calculate Risk
      </Button>

      {riskScore !== null && (
        <Alert
          severity={
            riskScore < 5 ? 'success' : riskScore < 10 ? 'warning' : 'error'
          }
          sx={{ mt: 3 }}
        >
          <strong>Risk Level:</strong> {getRiskLevel(riskScore)} ({riskScore})
        </Alert>
      )}
    </Box>
  );
};

export default RiskAssessmentTool;
