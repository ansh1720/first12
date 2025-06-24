import React, { useState, useEffect } from 'react';
import Autosuggest from 'react-autosuggest';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  TextField,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Chip,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

function DiseaseSearch({ onSelectDisease, sortBy, filterSymptom = '' }) {
  const [diseases, setDiseases] = useState([]);
  const [filteredDiseases, setFilteredDiseases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5000/api/diseases')
      .then((res) => res.json())
      .then((data) => {
        setDiseases(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    let filtered = diseases;

    if (query.trim() !== '') {
      filtered = filtered.filter((d) =>
        d.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (filterSymptom.trim() !== '') {
      filtered = filtered.filter((d) =>
        d.Symptoms?.some((symptom) =>
          symptom.toLowerCase().includes(filterSymptom.toLowerCase())
        )
      );
    }

    if (sortBy === 'name_asc') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name_desc') {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === 'symptomCount_asc') {
      filtered.sort((a, b) => (a.Symptoms?.length || 0) - (b.Symptoms?.length || 0));
    } else if (sortBy === 'symptomCount_desc') {
      filtered.sort((a, b) => (b.Symptoms?.length || 0) - (a.Symptoms?.length || 0));
    }

    setFilteredDiseases(filtered);
  }, [diseases, query, filterSymptom, sortBy]);

  const getSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase();
    return inputValue === ''
      ? []
      : diseases
          .filter((d) => d.name.toLowerCase().startsWith(inputValue))
          .slice(0, 5);
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const onSuggestionSelected = (_, { suggestion }) => {
    onSelectDisease(suggestion);
  };

  const renderInputComponent = (inputProps) => (
    <TextField
      {...inputProps}
      fullWidth
      variant="outlined"
      label={t('searchLabel')}
      autoComplete="off"
      sx={{ mb: 3 }}
    />
  );

  const highlightMatch = (text, query) => {
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return text;
    return (
      <>
        {text.substring(0, index)}
        <strong>{text.substring(index, index + query.length)}</strong>
        {text.substring(index + query.length)}
      </>
    );
  };

  const renderSuggestion = (suggestion, { isHighlighted }) => (
    <ListItem
      disablePadding
      selected={isHighlighted}
      sx={{ backgroundColor: isHighlighted ? '#e3f2fd' : 'transparent' }}
    >
      <ListItemButton>
        <ListItemText
          primary={highlightMatch(suggestion.name, query)}
          secondary={`${suggestion.Symptoms?.length || 0} ${t('symptoms')}`}
        />
      </ListItemButton>
    </ListItem>
  );

  const renderSuggestionsContainer = ({ containerProps, children }) => (
    <Paper {...containerProps} square sx={{ mt: 0 }}>
      <List sx={{ maxHeight: 200, overflowY: 'auto' }}>{children}</List>
    </Paper>
  );

  const inputProps = {
    placeholder: t('searchLabel'),
    value: query,
    onChange: (_, { newValue }) => setQuery(newValue),
  };

  return (
    <Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            getSuggestionValue={(suggestion) => suggestion.name}
            renderSuggestion={renderSuggestion}
            renderSuggestionsContainer={renderSuggestionsContainer}
            onSuggestionSelected={onSuggestionSelected}
            inputProps={inputProps}
            renderInputComponent={renderInputComponent}
          />

          {filteredDiseases.length === 0 && (
            <Typography sx={{ mt: 2, fontStyle: 'italic' }}>
              {t('noResults')}
            </Typography>
          )}

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))',
              gap: 2,
              mt: 2,
            }}
          >
            {filteredDiseases.map((disease) => (
              <Card
                key={disease._id}
                variant="outlined"
                sx={{
                  cursor: 'pointer',
                  '&:hover': { boxShadow: 4, backgroundColor: '#f5f5f5' },
                  transition: '0.3s',
                }}
                onClick={() => onSelectDisease(disease)}
              >
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    {disease.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {t('symptoms')}: {disease.Symptoms?.length || 0}
                  </Typography>
                  <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {(disease.Tags || []).map((tag, idx) => (
                      <Chip key={idx} size="small" label={tag} color="secondary" />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
}

export default DiseaseSearch;
