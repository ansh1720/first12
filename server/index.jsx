const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const Parser = require('rss-parser');

// Route files
const diseaseRoutes = require('./routes/diseaseRoutes.jsx');
const hospitalRoutes = require('./routes/hospitals.jsx');
const communityRoutes = require('./routes/communityRoutes.jsx');
const riskRoutes = require('./routes/riskRoutes.jsx');
const outbreaksRoutes = require('./routes/outbreakRoutes.jsx');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Init RSS parser with User-Agent header
const parser = new Parser({
  headers: { 'User-Agent': 'Mozilla/5.0 (DiseaseDashboardBot)' }
});

// Enable Socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

app.set('io', io);

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// API Routes
app.use('/api/diseases', diseaseRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/risk', riskRoutes);
app.use('/api/outbreaks', outbreaksRoutes);

// RSS Feed Endpoint with fallback logic
app.get('/api/rss', async (req, res) => {
  const feeds = [
    'https://news.google.com/rss/search?q=health+disease+outbreak&hl=en-IN&gl=IN&ceid=IN:en',
    'https://feeds.bbci.co.uk/news/health/rss.xml'
  ];

  try {
    const results = await Promise.all(
      feeds.map(async (url) => {
        try {
          console.log(`⏳ Fetching RSS from: ${url}`);
          const feed = await parser.parseURL(url);
          return feed.items || [];
        } catch (err) {
          console.error(`⚠️ Failed to fetch ${url}: ${err.message}`);
          return [];
        }
      })
    );

    const combinedItems = results.flat().slice(0, 10);
    res.json(combinedItems);
  } catch (error) {
    console.error('❌ Unexpected RSS error:', error.message);
    res.status(500).json({ error: error.message || 'Unknown error occurred' });
  }
});

// Health Check
app.get('/', (req, res) => {
  res.send('🌍 Disease Dashboard Backend is running');
});

// Real-time Alerts via Socket.io
app.post('/api/alert', (req, res) => {
  const { message } = req.body;
  if (message?.trim()) {
    io.emit('new-alert', message);
    return res.status(200).json({ status: '✅ Alert broadcasted' });
  }
  res.status(400).json({ error: '⚠️ No valid message provided' });
});

// Socket Connection Handling
io.on('connection', (socket) => {
  console.log('📡 New client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

// 404 Catch-all
app.use((req, res) => {
  res.status(404).send(`❌ Route not found: ${req.originalUrl}`);
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
