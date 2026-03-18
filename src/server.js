const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');

dotenv.config();
require('./config/db');

const app = express();

// ✅ Allow frontend (.pages.dev) + Render services
app.use(cors({
  origin: [
    /\.onrender\.com$/,
    /\.pages\.dev$/,
    'http://localhost:3000',
    'http://127.0.0.1:5500'
  ]
}));

app.use(helmet());
app.use(express.json());

app.use('/api/kyc', require('./routes/kyc.routes'));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'KS1 KYC System' });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[KS1 KYC] Running on port ${PORT}`);
});
