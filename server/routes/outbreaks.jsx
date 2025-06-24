const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/who-don', async (req, res) => {
  try {
    const resp = await axios.get('https://www.who.int/api/news/diseaseoutbreaknews');
    res.json(resp.data);
  } catch (e) {
    res.status(500).json({ error: 'WHO DON fetch failed' });
  }
});

module.exports = router;
