const express = require('express');
const router = express.Router();
const {
  registerUser, loginUser, adminLogin, selectSite, getProfile,
  getSupervisors, createSupervisor, updateSupervisor, deleteSupervisor, getSites,
} = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public
router.post('/register', registerUser);      // Step 1: supervisor submits name+email
router.post('/login', loginUser);            // Step 2: supervisor logs in with system credentials
router.post('/admin-login', adminLogin);     // Admin logs in with email+password
router.get('/sites', getSites);

// Protected
router.put('/select-site', protect, selectSite);
router.get('/profile', protect, getProfile);

// Admin only
router.get('/supervisors', protect, adminOnly, getSupervisors);
router.post('/supervisors', protect, adminOnly, createSupervisor);
router.put('/supervisors/:id', protect, adminOnly, updateSupervisor);
router.delete('/supervisors/:id', protect, adminOnly, deleteSupervisor);

module.exports = router;
