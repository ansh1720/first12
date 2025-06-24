const express = require('express');
const router = express.Router();
const Hospital = require('../models/Hospital');

// GET all hospitals
router.get('/', async (req, res) => {
  try {
    const hospitals = await Hospital.find();
    res.json(hospitals);
  } catch (error) {
    console.error('Error fetching hospitals:', error);
    res.status(500).json({ error: 'Failed to fetch hospitals' });
  }
});

// GET nearby hospitals using geospatial query
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, radius } = req.query;

    if (!lat || !lng || !radius) {
      return res.status(400).json({ error: 'Missing lat, lng, or radius parameter' });
    }

    const hospitals = await Hospital.find({
      location: {
        $geoWithin: {
          $centerSphere: [
            [parseFloat(lng), parseFloat(lat)],
            parseFloat(radius) / 6378.1 // Radius in radians
          ],
        },
      },
    });

    res.json(hospitals);
  } catch (error) {
    console.error('Error searching nearby hospitals:', error);
    res.status(500).json({ error: 'Failed to fetch nearby hospitals' });
  }
});

// POST - Add new hospital
router.post('/', async (req, res) => {
  try {
    const newHospital = new Hospital(req.body);
    await newHospital.save();
    res.status(201).json(newHospital);
  } catch (err) {
    console.error('Error creating hospital:', err);
    res.status(500).json({ error: 'Failed to create hospital' });
  }
});

// PUT - Update hospital
router.put('/:id', async (req, res) => {
  try {
    const updated = await Hospital.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Hospital not found' });

    res.json(updated);
  } catch (err) {
    console.error('Error updating hospital:', err);
    res.status(500).json({ error: 'Failed to update hospital' });
  }
});

// DELETE - Delete hospital
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Hospital.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Hospital not found' });

    res.json({ message: '✅ Hospital deleted' });
  } catch (err) {
    console.error('Error deleting hospital:', err);
    res.status(500).json({ error: 'Failed to delete hospital' });
  }
});

module.exports = router;
