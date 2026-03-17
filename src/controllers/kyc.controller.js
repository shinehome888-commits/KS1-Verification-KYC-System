const KycRequest = require('../models/KycRequest.model');

// Minimal placeholder functions — expand later
const startVerification = async (req, res) => {
  const { smeId } = req.body;
  if (!smeId) return res.status(400).json({ message: 'smeId required' });
  await KycRequest.findOneAndUpdate(
    { smeId },
    { smeId, riskLevel: 'LOW' },
    { upsert: true, new: true }
  );
  res.json({ success: true, status: 'KYC_PENDING' });
};

const getStatus = async (req, res) => {
  const kyc = await KycRequest.findOne({ smeId: req.params.smeId });
  res.json(kyc || {});
};

const getPendingReviews = async (req, res) => {
  const pending = await KycRequest.find({ status: 'KYC_PENDING' });
  res.json(pending);
};

const approveSME = async (req, res) => {
  const { smeId } = req.body;
  await KycRequest.findOneAndUpdate({ smeId }, { status: 'KYC_APPROVED' });
  res.json({ success: true });
};

const rejectSME = async (req, res) => {
  const { smeId } = req.body;
  await KycRequest.findOneAndUpdate({ smeId }, { status: 'KYC_REJECTED' });
  res.json({ success: true });
};

const getStats = async (req, res) => {
  const verified = await KycRequest.countDocuments({ status: 'KYC_APPROVED' });
  const pending = await KycRequest.countDocuments({ status: 'KYC_PENDING' });
  res.json({ verified, pending });
};

module.exports = {
  startVerification,
  getStatus,
  getPendingReviews,
  approveSME,
  rejectSME,
  getStats
};
