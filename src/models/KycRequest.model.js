const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  smeId: String,
  status: { type: String, default: 'KYC_PENDING' },
  riskLevel: String
});
module.exports = mongoose.model('KycRequest', schema);
