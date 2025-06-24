const mongoose = require('mongoose');
const Hospital = require('../models/Hospital'); // Adjust path as needed

// Connect to your MongoDB
mongoose.connect('mongodb://localhost:27017/diseaseDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const hospitals = [
  {
    name: 'City Hospital',
    lat: 28.6139,
    lng: 77.2090,
    rating: 4.3,
    reviews: 124,
  },
  {
    name: 'Global Care Clinic',
    lat: 28.6145,
    lng: 77.2065,
    rating: 4.0,
    reviews: 98,
  },
  {
    name: 'Sunrise Medical Center',
    lat: 28.6125,
    lng: 77.2105,
    rating: 3.9,
    reviews: 87,
  },
];

Hospital.insertMany(hospitals)
  .then(() => {
    console.log('✅ Hospital data inserted');
    mongoose.disconnect();
  })
  .catch((error) => {
    console.error('❌ Error inserting hospitals:', error);
    mongoose.disconnect();
  });
