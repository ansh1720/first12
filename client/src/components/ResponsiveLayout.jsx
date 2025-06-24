// components/ResponsiveLayout.js
import React from 'react';
import { Box, Container, useMediaQuery, useTheme } from '@mui/material';

const ResponsiveLayout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container
      maxWidth="lg"
      disableGutters={isMobile}
      sx={{
        padding: isMobile ? 1 : 3,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      {children}
    </Container>
  );
};

export default ResponsiveLayout;
