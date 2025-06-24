const mongoose = require('mongoose');

const diseaseSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  symptoms: [String],
  cause: String,
  prevention: String,
  treatment: String,
  riskFactors: [String],
  tags: [String],
  source: {
    name: String,      // e.g., 'WHO', 'CDC', 'NHS'
    url: String        // link to the source article
  }
}, { timestamps: true });

module.exports = mongoose.model('Disease', diseaseSchema);
