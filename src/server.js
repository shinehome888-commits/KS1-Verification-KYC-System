const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

async function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied. No token.' });

  try {
    const response = await fetch('https://ks1-central-auth.onrender.com/auth/verify', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) return res.status(401).json({ error: 'Invalid token' });
    const user = await response.json();
    req.user = user;
    next();
  } catch (err) {
    console.error('Auth verification failed:', err);
    res.status(500).json({ error: 'Auth service unavailable' });
  }
}

app.use('/api', authenticateToken);

// Your KYC routes
app.get('/api/kyc/status/:smeId', (req, res) => {
  // You can verify smeId matches req.user.trade_id if needed
  res.json({ status: 'KYC_APPROVED' });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`✅ KS1 KYC System running on port ${PORT}`);
});
