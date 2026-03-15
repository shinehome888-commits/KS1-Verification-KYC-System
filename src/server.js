const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');

dotenv.config();
require('./config/db');

const app = express();

app.use(helmet());
app.use(cors({ origin: /\.pages\.dev$/ }));
app.use(express.json());

app.use('/api/kyc', require('./routes/kyc.routes'));

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'KS1 KYC System',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[KS1 KYC] Running on port ${PORT}`);
});
