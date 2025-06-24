const mongoose = require('mongoose');

const RiskAssessmentSchema = new mongoose.Schema({
  userId: String,
  age: Number,
  symptoms: [String],
  conditions: [String],
  location: String,
  familyHistory: [String],
  diseaseProbabilities: Object,
  finalScore: Number,
  riskLevel: String,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('RiskAssessment', RiskAssessmentSchema);
