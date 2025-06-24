import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  List,
  ListItem,
  IconButton,
  Typography,
  Box,
  Paper,
  Chip,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';

const API = 'http://localhost:5000/api/diseases';
const AUTH_HEADER = { Authorization: 'Bearer admin123' };

function AdminPanel() {
  const [diseases, setDiseases] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    symptoms: '',
    prevention: '',
    treatment: '',
    cause: '',
    tags: '',
    sourceName: '',
    sourceUrl: '',
  });
  const [editId, setEditId] = useState(null);

  const fetchDiseases = () => {
    fetch(API)
      .then((res) => res.json())
      .then((data) =>
        setDiseases(
          data.map((d) => ({
            ...d,
            symptoms: Array.isArray(d.symptoms) ? d.symptoms : [],
            tags: Array.isArray(d.tags) ? d.tags : [],
            source: d.source || {},
          }))
        )
      );
  };

  useEffect(() => {
    fetchDiseases();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `${API}/${editId}` : API;
    const payload = {
      name: formData.name,
      symptoms: formData.symptoms
        ? formData.symptoms.split(',').map((s) => s.trim())
        : [],
      prevention: formData.prevention,
      treatment: formData.treatment,
      cause: formData.cause,
      tags: formData.tags
        ? formData.tags.split(',').map((t) => t.trim())
        : [],
      source: {
        name: formData.sourceName,
        url: formData.sourceUrl,
      },
    };

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', ...AUTH_HEADER },
      body: JSON.stringify(payload),
    }).then(() => {
      fetchDiseases();
      setFormData({
        name: '',
        symptoms: '',
        prevention: '',
        treatment: '',
        cause: '',
        tags: '',
        sourceName: '',
        sourceUrl: '',
      });
      setEditId(null);
    });
  };

  const handleDelete = (id) => {
    fetch(`${API}/${id}`, { method: 'DELETE', headers: AUTH_HEADER }).then(
      fetchDiseases
    );
  };

  const handleEdit = (disease) => {
    setFormData({
      name: disease.name,
      symptoms: disease.symptoms.join(', '),
      prevention: disease.prevention,
      treatment: disease.treatment,
      cause: disease.cause || '',
      tags: disease.tags.join(', '),
      sourceName: disease.source?.name || '',
      sourceUrl: disease.source?.url || '',
    });
    setEditId(disease._id);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Admin Panel
      </Typography>
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          name="name"
          label="Disease Name"
          value={formData.name}
          onChange={handleChange}
          fullWidth sx={{ mb: 2 }}
        />
        <TextField
          name="symptoms"
          label="Symptoms (comma separated)"
          value={formData.symptoms}
          onChange={handleChange}
          fullWidth sx={{ mb: 2 }}
        />
        <TextField
          name="cause"
          label="Cause"
          value={formData.cause}
          onChange={handleChange}
          fullWidth sx={{ mb: 2 }}
        />
        <TextField
          name="prevention"
          label="Prevention"
          value={formData.prevention}
          onChange={handleChange}
          fullWidth sx={{ mb: 2 }}
        />
        <TextField
          name="treatment"
          label="Treatment"
          value={formData.treatment}
          onChange={handleChange}
          fullWidth sx={{ mb: 2 }}
        />
        <TextField
          name="tags"
          label="Tags (comma separated)"
          value={formData.tags}
          onChange={handleChange}
          fullWidth sx={{ mb: 2 }}
        />
        <TextField
          name="sourceName"
          label="Source Name"
          value={formData.sourceName}
          onChange={handleChange}
          fullWidth sx={{ mb: 2 }}
        />
        <TextField
          name="sourceUrl"
          label="Source URL"
          value={formData.sourceUrl}
          onChange={handleChange}
          fullWidth sx={{ mb: 2 }}
        />
        <Button variant="contained" onClick={handleSubmit}>
          {editId ? 'Update' : 'Add'}
        </Button>
      </Paper>

      <List>
        {diseases.map((d) => (
          <ListItem
            key={d._id}
            secondaryAction={
              <>
                <IconButton onClick={() => handleEdit(d)}><Edit /></IconButton>
                <IconButton onClick={() => handleDelete(d._id)}><Delete /></IconButton>
              </>
            }
          >
            <Box>
              <Typography variant="subtitle1">{d.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                Symptoms: {d.symptoms.join(', ')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Cause: {d.cause || 'N/A'}
              </Typography>
              {d.source?.url && (
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  Source:{' '}
                  <a href={d.source.url} target="_blank" rel="noopener noreferrer">
                    {d.source.name || d.source.url}
                  </a>
                </Typography>
              )}
              <Box sx={{ mt: 1 }}>
                {d.tags.map((tag, idx) => (
                  <Chip key={idx} label={tag} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                ))}
              </Box>
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default AdminPanel;
