const mongoose = require('mongoose');

const KycRequestSchema = new mongoose.Schema({
  smeId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  status: { 
    type: String, 
    enum: ['KYC_PENDING', 'KYC_APPROVED', 'KYC_REJECTED'], 
    default: 'KYC_PENDING' 
  },
  riskLevel: { 
    type: String, 
    enum: ['LOW', 'MEDIUM', 'HIGH'] 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// This creates the collection 'kycrequests' in the 'ks1_kyc' database
module.exports = mongoose.model('KycRequest', KycRequestSchema);
