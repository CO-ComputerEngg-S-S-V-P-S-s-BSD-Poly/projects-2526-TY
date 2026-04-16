const express = require('express');
const router = express.Router();
const {
  createRequest,
  getAllRequests,
  getMyRequests,
  updateRequestStatus,
} = require('../controllers/requestController');
const { protect, adminOnly, supervisorOnly } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/request', supervisorOnly, createRequest);
router.get('/requests', adminOnly, getAllRequests);
router.get('/my-requests', supervisorOnly, getMyRequests);
router.put('/request/:id', adminOnly, updateRequestStatus);

module.exports = router;
