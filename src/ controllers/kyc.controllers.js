const KycRequest = require('../models/KycRequest.model');

const getStats = async (req, res) => {
  try {
    const verified = await KycRequest.countDocuments({ status: 'KYC_APPROVED' });
    const pending = await KycRequest.countDocuments({ status: 'KYC_PENDING' });
    res.json({ verified, pending });
  } catch (err) {
    res.status(500).json({ verified: 0, pending: 0 });
  }
};

// Minimal placeholder functions to avoid "undefined" errors
const startVerification = (req, res) => res.json({ success: true });
const getStatus = (req, res) => res.json({});
const getPendingReviews = (req, res) => res.json([]);
const approveSME = (req, res) => res.json({ success: true });
const rejectSME = (req, res) => res.json({ success: true });

module.exports = {
  startVerification,
  getStatus,
  getPendingReviews,
  approveSME,
  rejectSME,
  getStats
};
