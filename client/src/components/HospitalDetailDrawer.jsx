// components/HospitalDetailDrawer.js
import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  Divider,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const HospitalDetailDrawer = ({ hospital, onClose }) => {
  return (
    <Drawer anchor="right" open={!!hospital} onClose={onClose}>
      <Box sx={{ width: 350, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Hospital Details</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 2 }} />
        {hospital && (
          <>
            <Typography><strong>Name:</strong> {hospital.name}</Typography>
            <Typography><strong>Address:</strong> {hospital.address}</Typography>
            <Typography><strong>Latitude:</strong> {hospital.location.coordinates[1]}</Typography>
            <Typography><strong>Longitude:</strong> {hospital.location.coordinates[0]}</Typography>
            {/* Add more fields as needed */}
          </>
        )}
      </Box>
    </Drawer>
  );
};

export default HospitalDetailDrawer;
