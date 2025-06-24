import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  Rating,
} from '@mui/material';

const HospitalDetails = ({ hospital, open, onClose }) => {
  if (!hospital) return null;

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 350, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          {hospital.name}
        </Typography>
        <Typography variant="body2" gutterBottom>
          <strong>Address:</strong> {hospital.address}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1">Rating</Typography>
        <Rating value={hospital.rating || 0} readOnly precision={0.5} />

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1">Reviews</Typography>
        <List dense>
          {hospital.reviews && hospital.reviews.length > 0 ? (
            hospital.reviews.map((review, index) => (
              <ListItem key={index}>
                <ListItemText primary={review.comment} secondary={`By ${review.user}`} />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="No reviews available." />
            </ListItem>
          )}
        </List>
      </Box>
    </Drawer>
  );
};

export default HospitalDetails;
