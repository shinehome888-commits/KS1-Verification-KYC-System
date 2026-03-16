const KycRequest = require('../models/KycRequest.model');
const IdentityRecord = require('../models/IdentityRecord.model');
const VerificationResult = require('../models/VerificationResult.model');
const { calculateRiskLevel } = require('../services/riskEngine.service');

// 🔥 UPDATED: Now triggers BOTH Trade ID and Trust Score
const approveInternally = async (smeId, businessName) => {
  await KycRequest.findOneAndUpdate({ smeId }, { status: 'KYC_APPROVED' });
  console.log('✅ [APPROVED] SME:', smeId, '| Business:', businessName);

  // 🔑 STEP 1: Generate KS1 Trade ID
  try {
    const tradeRes = await fetch('https://ks1-trade-id.onrender.com/api/generate-trade-id', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ smeId, businessName })
    });
    if (tradeRes.ok) {
      console.log('✅ KS1 Trade ID generated for:', smeId);
    } else {
      console.warn('⚠️ Trade ID generation returned non-OK status');
    }
  } catch (err) {
    console.error('❌ Failed to generate Trade ID:', err.message);
  }

  // 🌟 STEP 2: Notify Trust Score
  try {
    await fetch('https://ks1-trust-score.onrender.com/api/trust/recalculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        smeId,
        eventType: 'kyc.verified',
        eventData: {}
      })
    });
    console.log('✅ Trust Score event sent for KYC verification');
  } catch (err) {
    console.error('❌ Failed to notify Trust Score:', err.message);
  }
};

const startVerification = async (req, res) => {
  try {
    const { smeId, businessName, ownerName, idType, idNumber, documentUrls, city } = req.body;

    if (!smeId || !ownerName || !idType || !idNumber) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    await IdentityRecord.create({
      smeId,
      ownerName,
      idType,
      idNumber,
      documentUrl: Array.isArray(documentUrls) ? documentUrls[0] : documentUrls
    });

    const riskLevel = await calculateRiskLevel({ smeId, idType, idNumber, city });
    await KycRequest.create({ smeId, riskLevel });

    if (riskLevel === 'LOW') {
      await approveInternally(smeId, businessName);
      return res.json({ success: true, status: 'KYC_APPROVED', riskLevel });
    }

    res.json({ success: true, status: 'KYC_PENDING', riskLevel, message: 'Awaiting manual review' });
  } catch (err) {
    console.error('KYC Error:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getStatus = async (req, res) => {
  try {
    const kyc = await KycRequest.findOne({ smeId: req.params.smeId });
    if (!kyc) return res.status(404).json({ message: 'Not found' });
    res.json(kyc);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getPendingReviews = async (req, res) => {
  try {
    const pending = await KycRequest.find({
      status: 'KYC_PENDING',
      riskLevel: { $in: ['MEDIUM', 'HIGH'] }
    }).limit(50).lean();

    res.json(pending || []);
  } catch (err) {
    console.error('Pending reviews error:', err.message);
    res.status(500).json([]);
  }
};

const approveSME = async (req, res) => {
  try {
    const { smeId, businessName } = req.body;
    await KycRequest.findOneAndUpdate({ smeId }, { status: 'KYC_APPROVED' });
    await VerificationResult.create({ smeId, decision: 'APPROVED', reviewedBy: 'admin' });
    await approveInternally(smeId, businessName);
    res.json({ success: true, message: 'Approved' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const rejectSME = async (req, res) => {
  try {
    const { smeId, reason } = req.body;
    await KycRequest.findOneAndUpdate({ smeId }, { status: 'KYC_REJECTED' });
    await VerificationResult.create({ smeId, decision: 'REJECTED', reviewNotes: reason, reviewedBy: 'admin' });
    res.json({ success: true, message: 'Rejected' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  startVerification,
  getStatus,
  approveSME,
  rejectSME,
  getPendingReviews
};
