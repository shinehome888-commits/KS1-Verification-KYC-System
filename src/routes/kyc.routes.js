const express = require('express');
const router = express.Router();
const trustController = require('../controllers/trust.controller');

router.post('/recalculate', trustController.recalculateTrustScore);
router.get('/score/:smeId', trustController.getTrustScore);
router.get('/leaderboard', trustController.getLeaderboard);
router.get('/stats', trustController.getStats);

module.exports = router;
