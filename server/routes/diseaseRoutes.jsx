const express = require('express');
const router = express.Router();
const Disease = require('../models/Disease');
const Symptom = require('../models/Symptom'); // Assumed path is correct

// Simulated basic admin auth middleware
const verifyAdmin = (req, res, next) => {
  const token = req.headers['authorization'];
  if (token === 'Bearer admin123') {
    next();
  } else {
    res.status(401).json({ message: '❌ Unauthorized: Admin token missing or invalid' });
  }
};

// GET all diseases
router.get('/', async (req, res) => {
  try {
    const diseases = await Disease.find();
    res.json(diseases);
  } catch (err) {
    console.error('Error fetching diseases:', err);
    res.status(500).json({ message: 'Failed to fetch diseases' });
  }
});

// GET all disease names + symptoms for prediction tool
router.get('/all-symptoms', async (req, res) => {
  try {
    const allSymptoms = await Symptom.find({}, 'disease symptoms');
    res.json(allSymptoms);
  } catch (err) {
    console.error('Error fetching symptoms:', err);
    res.status(500).json({ message: 'Failed to fetch symptoms' });
  }
});

// POST create new disease
router.post('/', verifyAdmin, async (req, res) => {
  const { name, mainContentText, mainContentHtml, url, symptoms, cause, prevention, treatment, tags, alertMessage } = req.body;

  if (!name || !mainContentText) {
    return res.status(400).json({ message: '❗ Name and main content text are required' });
  }

  const newDisease = new Disease({
    name,
    mainContentText,
    mainContentHtml,
    url,
    symptoms: symptoms || [],
    cause: cause || '',
    prevention: prevention || '',
    treatment: treatment || '',
    tags: tags || [],
    scrapedAt: new Date()
  });

  try {
    const saved = await newDisease.save();

    // Emit real-time alert via Socket.IO if applicable
    if (alertMessage) {
      const io = req.app.get('io');
      io?.emit('new-alert', alertMessage);
    }

    res.status(201).json(saved);
  } catch (err) {
    console.error('Error saving disease:', err);
    res.status(500).json({ message: 'Failed to save disease' });
  }
});

// PUT update disease
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const updated = await Disease.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Disease not found' });
    }
    res.json(updated);
  } catch (err) {
    console.error('Error updating disease:', err);
    res.status(400).json({ message: 'Failed to update disease' });
  }
});

// DELETE disease
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const deleted = await Disease.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Disease not found' });
    }
    res.json({ message: '✅ Disease deleted successfully' });
  } catch (err) {
    console.error('Error deleting disease:', err);
    res.status(400).json({ message: 'Failed to delete disease' });
  }
});

module.exports = router;
