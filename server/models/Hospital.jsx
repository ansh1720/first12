const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  name: String,
  lat: Number,
  lng: Number,
  rating: Number,
  reviews: Number,
});

module.exports = mongoose.model('Hospital', hospitalSchema);
