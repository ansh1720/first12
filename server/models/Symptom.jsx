// models/Symptom.js
const mongoose = require('mongoose');

const SymptomSchema = new mongoose.Schema({
  disease: String,
  symptoms: [String]
});

module.exports = mongoose.model('Symptom', SymptomSchema);
