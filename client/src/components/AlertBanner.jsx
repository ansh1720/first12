// AlertBanner.js
import React from 'react';
import { Alert } from '@mui/material';

function AlertBanner({ message }) {
  if (!message) return null;

  return (
    <Alert severity="warning" sx={{ mb: 2 }}>
      🚨 {message}
    </Alert>
  );
}

export default AlertBanner;
