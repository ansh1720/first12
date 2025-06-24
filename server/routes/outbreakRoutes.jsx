const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/', async (req, res) => {
  try {
    const { data } = await axios.get('https://ghoapi.azureedge.net/api/GHO', {
      params: {
        $filter: "Indicator eq 'NEW_CASES'",
        $top: 100
      },
      headers: {
        'User-Agent': 'DiseaseDashboardBackend/1.0'
      },
      timeout: 5000 // optional timeout for external API
    });

    if (!data?.value || data.value.length === 0) {
      return res.status(204).json({ message: 'No outbreak data found.' });
    }

    res.json(data.value);
  } catch (err) {
    console.error('Error fetching outbreak data:', err.message);
    res.status(502).json({ error: 'Unable to retrieve WHO outbreak data.' });
  }
});

module.exports = router;
