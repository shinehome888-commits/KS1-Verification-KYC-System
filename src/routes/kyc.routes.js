const express = require('express');
const { requireAdmin } = require('../middleware/auth.middleware');
const { 
  startVerification, 
  getStatus, 
  approveSME, 
  rejectSME, 
  getPendingReviews 
} = require('../controllers/kyc.controller');

const router = express.Router();

router.post('/start-verification', startVerification);
router.get('/status/:smeId', getStatus);
router.get('/pending', requireAdmin, getPendingReviews);
router.post('/admin/approve', requireAdmin, approveSME);
router.post('/admin/reject', requireAdmin, rejectSME);

module.exports = router;
