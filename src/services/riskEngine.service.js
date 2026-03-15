const isValidGhanaCard = (id) => /^GHA\d{9}$/.test(id);
const isValidPassport = (id) => /^[A-Z]{2}\d{7}$/.test(id);

const validateDocument = (idType, idNumber) => {
  if (idType === 'Ghana Card') return isValidGhanaCard(idNumber);
  if (idType === 'Passport') return isValidPassport(idNumber);
  return idNumber?.length > 5;
};

exports.calculateRiskLevel = async (data) => {
  let riskScore = 0;

  if (!validateDocument(data.idType, data.idNumber)) riskScore += 40;

  const duplicate = await require('../models/IdentityRecord').findOne({
    smeId: { $ne: data.smeId }
  });
  if (duplicate) riskScore += 50;

  if (data.city && !['Accra', 'Kumasi', 'Takoradi', 'Cape Coast'].includes(data.city)) riskScore += 10;

  if (riskScore >= 50) return 'HIGH';
  if (riskScore >= 20) return 'MEDIUM';
  return 'LOW';
};
