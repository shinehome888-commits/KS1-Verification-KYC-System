const mongoose = require('mongoose');

const VerificationResultSchema = new mongoose.Schema({
  smeId: { type: String, required: true },
  decision: { type: String, enum: ['APPROVED', 'REJECTED'] },
  riskLevel: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'] },
  reviewNotes: String,
  reviewedBy: String,
  reviewDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('VerificationResult', VerificationResultSchema);
