const TrustScore = require('../models/TrustScore.model');

const recalculateTrustScore = async (req, res) => {
  try {
    const { smeId, eventType, eventData } = req.body;
    if (!smeId || !eventType) {
      return res.status(400).json({ message: 'smeId and eventType required' });
    }

    let scoreDoc = await TrustScore.findOne({ smeId });
    if (!scoreDoc) {
      scoreDoc = new TrustScore({
        smeId,
        trustScore: 50,
        completedTransactions: 0,
        disputesCount: 0,
        tradeVolume: 0
      });
    }

    switch (eventType) {
      case 'kyc.verified':
        scoreDoc.trustScore = Math.min(100, scoreDoc.trustScore + 15);
        break;
      case 'transaction.completed':
        const amount = eventData?.amount || 0;
        scoreDoc.completedTransactions += 1;
        scoreDoc.tradeVolume += amount;
        scoreDoc.trustScore = Math.min(100, scoreDoc.trustScore + 5);
        break;
      case 'dispute.opened':
        scoreDoc.disputesCount += 1;
        scoreDoc.trustScore = Math.max(0, scoreDoc.trustScore - 10);
        break;
    }

    if (scoreDoc.trustScore >= 80) scoreDoc.trustTier = 'Platinum';
    else if (scoreDoc.trustScore >= 70) scoreDoc.trustTier = 'Gold';
    else if (scoreDoc.trustScore >= 60) scoreDoc.trustTier = 'Silver';
    else scoreDoc.trustTier = 'Bronze';

    await scoreDoc.save();
    res.json({ success: true, trustScore: scoreDoc.trustScore, trustTier: scoreDoc.trustTier });
  } catch (err) {
    console.error('Recalculate error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getTrustScore = async (req, res) => {
  try {
    const score = await TrustScore.findOne({ smeId: req.params.smeId });
    if (!score) {
      return res.json({ smeId: req.params.smeId, trustScore: 50, trustTier: 'Bronze' });
    }
    res.json(score);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const top = await TrustScore.find()
      .sort({ trustScore: -1 })
      .limit(5)
      .select('smeId trustScore trustTier businessName');
    res.json(top);
  } catch (err) {
    res.status(500).json([]);
  }
};

const getStats = async (req, res) => {
  try {
    const scores = await TrustScore.find().select('trustScore');
    const avg = scores.length
      ? parseFloat((scores.reduce((sum, s) => sum + s.trustScore, 0) / scores.length).toFixed(1))
      : 50;
    res.json({ average: avg });
  } catch (err) {
    res.status(500).json({ average: 50 });
  }
};

module.exports = {
  recalculateTrustScore,
  getTrustScore,
  getLeaderboard,
  getStats
};
