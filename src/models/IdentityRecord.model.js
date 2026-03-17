const mongoose = require('mongoose');

const IdentityRecordSchema = new mongoose.Schema({
  smeId: { type: String, required: true },
  ownerName: String,
  idType: String,
  idNumber: String,
  documentUrl: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('IdentityRecord', IdentityRecordSchema);
