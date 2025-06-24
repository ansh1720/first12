const express = require('express');
const router = express.Router();
const RiskAssessment = require('../models/RiskAssessment');

// POST risk data to MongoDB for tracking trends
router.post('/assess', async (req, res) => {
  try {
    const {
      userId,
      age,
      symptoms,
      conditions,
      location,
      familyHistory,
      diseaseProbabilities,
      finalScore,
      riskLevel,
    } = req.body;

    if (!userId || !Array.isArray(symptoms) || typeof finalScore !== 'number') {
      return res.status(400).json({ error: 'Invalid or missing key fields in request body' });
    }

    const newAssessment = new RiskAssessment({
      userId,
      age,
      symptoms,
      conditions,
      location,
      familyHistory,
      diseaseProbabilities,
      finalScore,
      riskLevel,
      timestamp: new Date(),
    });

    await newAssessment.save();
    res.status(201).json({ message: '✅ Risk assessment saved successfully' });
  } catch (error) {
    console.error('❌ Error saving risk assessment:', error);
    res.status(500).json({ error: 'Failed to save risk assessment' });
  }
});

// GET risk history for a specific user
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId in request parameters' });
    }

    const history = await RiskAssessment.find({ userId }).sort({ timestamp: -1 });

    if (!history.length) {
      return res.status(204).send(); // No content
    }

    res.json(history);
  } catch (error) {
    console.error('❌ Error fetching risk history:', error);
    res.status(500).json({ error: 'Failed to fetch risk history' });
  }
});

module.exports = router;
