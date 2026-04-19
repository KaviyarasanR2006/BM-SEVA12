const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const biowasteRoutes = require('./routes/biowaste');
const reportRoutes = require('./routes/report');
const reminderRoutes = require('./routes/reminder');

const PORT = process.env.PORT || 5500;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/biowaste-disposal';

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'dashboard.html'));
});

app.use('/api/auth', (req, res, next) => {
  req.pathname = req.path;
  next();
}, (req, res) => authRoutes.handle(req, res));

app.use('/api/biowaste', (req, res, next) => {
  req.pathname = req.path;
  next();
}, (req, res) => biowasteRoutes.handle(req, res));

app.use('/api/reports', (req, res, next) => {
  req.pathname = req.path;
  next();
}, (req, res) => reportRoutes.handle(req, res));

app.use('/api/reminders', (req, res, next) => {
  req.pathname = req.path;
  next();
}, (req, res) => reminderRoutes.handle(req, res));

app.get('/api/endpoint', (req, res) => {
  const dummyData = [
    { name: 'Waste Bin 1' },
    { name: 'Waste Bin 2' },
    { name: 'Waste Bin 3' }
  ];
  res.json(dummyData);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
