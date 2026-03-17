const express = require('express');
const router = express.Router();
const kycController = require('../controllers/kyc.controller');

router.post('/start-verification', kycController.startVerification);
router.get('/status/:smeId', kycController.getStatus);
router.get('/pending', kycController.getPendingReviews);
router.post('/admin/approve', kycController.approveSME);
router.post('/admin/reject', kycController.rejectSME);
router.get('/stats', kycController.getStats); // 👈 STATS ENDPOINT

module.exports = router;
