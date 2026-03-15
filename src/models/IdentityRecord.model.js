const mongoose = require('mongoose');
const CryptoJS = require('crypto-js');

const IdentityRecordSchema = new mongoose.Schema({
  smeId: { type: String, required: true },
  ownerName: { type: String, required: true },
  idType: { type: String, required: true },
  idNumber: {
    type: String,
    set: (val) => CryptoJS.AES.encrypt(val, process.env.JWT_SECRET).toString()
  },
  documentUrl: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('IdentityRecord', IdentityRecordSchema);
