const express = require('express');
const router = express.Router();
const { getAllUsageHistory, getMyUsageHistory, getUsageReport } = require('../controllers/usageController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/usage-history', adminOnly, getAllUsageHistory);
router.get('/my-usage-history', getMyUsageHistory);
router.get('/usage-report', adminOnly, getUsageReport);

module.exports = router;
