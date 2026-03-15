const mongoose = require('mongoose');

const KycRequestSchema = new mongoose.Schema({
  smeId: { type: String, required: true, unique: true },
  status: { type: String, enum: ['KYC_PENDING', 'KYC_APPROVED', 'KYC_REJECTED'], default: 'KYC_PENDING' },
  riskLevel: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('KycRequest', KycRequestSchema);
