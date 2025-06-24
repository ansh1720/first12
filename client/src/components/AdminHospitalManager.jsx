import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import axios from 'axios';

const AdminHospitalManager = () => {
  const [hospitals, setHospitals] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: '', severity: 'info' });

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    rating: '',
    lat: '',
    lng: '',
  });

  const showAlert = (message, severity = 'info') => {
    setAlert({ message, severity });
  };

  const fetchHospitals = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/hospitals');
      setHospitals(res.data);
    } catch (error) {
      showAlert('Failed to fetch hospitals', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  const handleOpen = (hospital = null) => {
    if (hospital) {
      setEditing(hospital._id);
      setFormData({
        name: hospital.name,
        address: hospital.address,
        rating: hospital.rating,
        lat: hospital.location.coordinates[1],
        lng: hospital.location.coordinates[0],
      });
    } else {
      setEditing(null);
      setFormData({
        name: '',
        address: '',
        rating: '',
        lat: '',
        lng: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditing(null);
  };

  const handleSubmit = async () => {
    const { name, address, rating, lat, lng } = formData;
    if (!name || !address || !lat || !lng || isNaN(lat) || isNaN(lng)) {
      return showAlert('Please fill all fields correctly', 'warning');
    }

    const hospitalData = {
      name,
      address,
      rating: parseFloat(rating),
      location: {
        type: 'Point',
        coordinates: [parseFloat(lng), parseFloat(lat)],
      },
    };

    try {
      if (editing) {
        await axios.put(`http://localhost:5000/api/hospitals/${editing}`, hospitalData);
        showAlert('Hospital updated successfully', 'success');
      } else {
        await axios.post('http://localhost:5000/api/hospitals', hospitalData);
        showAlert('Hospital added successfully', 'success');
      }
      handleClose();
      fetchHospitals();
    } catch (error) {
      console.error(error);
      showAlert('Operation failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this hospital?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/hospitals/${id}`);
      showAlert('Hospital deleted', 'success');
      fetchHospitals();
    } catch (error) {
      console.error(error);
      showAlert('Delete failed', 'error');
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Manage Hospitals
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        Add Hospital
      </Button>

      {loading ? (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        <List>
          {hospitals.map((hosp) => (
             <ListItem
            key={hosp._id}
            secondaryAction={
                <>
                <IconButton onClick={() => handleOpen(hosp)}><Edit /></IconButton>
                <IconButton onClick={() => handleDelete(hosp._id)}><Delete /></IconButton>
                <Button
                    size="small"
                    variant="outlined"
                    sx={{ ml: 1 }}
                    onClick={() =>
                    window.open(
                        `https://www.google.com/maps/dir/?api=1&destination=${hosp.location.coordinates[1]},${hosp.location.coordinates[0]}`,
                        '_blank'
                    )
                    }
                >
                    Directions
                </Button>
                </>
            }
            >
            <ListItemText
                primary={`${hosp.name} (${hosp.rating || 'N/A'})`}
                secondary={hosp.address}
            />
            </ListItem>

          ))}
        </List>
      )}

      {/* Dialog for Add/Edit */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editing ? 'Edit Hospital' : 'Add Hospital'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
            required
          />
          <TextField
            label="Address"
            value={formData.address}
            onChange={(e) => setFormData((f) => ({ ...f, address: e.target.value }))}
            required
          />
          <TextField
            label="Rating"
            type="number"
            inputProps={{ min: 0, max: 5, step: 0.1 }}
            value={formData.rating}
            onChange={(e) => setFormData((f) => ({ ...f, rating: e.target.value }))}
          />
          <TextField
            label="Latitude"
            type="number"
            value={formData.lat}
            onChange={(e) => setFormData((f) => ({ ...f, lat: e.target.value }))}
            required
          />
          <TextField
            label="Longitude"
            type="number"
            value={formData.lng}
            onChange={(e) => setFormData((f) => ({ ...f, lng: e.target.value }))}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editing ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Feedback Snackbar */}
      <Snackbar
        open={!!alert.message}
        autoHideDuration={3000}
        onClose={() => setAlert({ ...alert, message: '' })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={alert.severity} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminHospitalManager;
