const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to MongoDB
require('./config/db');

const app = express();

// Security & middleware
app.use(helmet());
app.use(cors({ origin: /\.onrender\.com$/ })); // Allow only Render frontend
app.use(express.json());

// Routes
app.use('/api/trust', require('./routes/trust.routes'));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'KS1 Trust Score' });
});

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[KS1 TRUST] Running on port ${PORT}`);
});
