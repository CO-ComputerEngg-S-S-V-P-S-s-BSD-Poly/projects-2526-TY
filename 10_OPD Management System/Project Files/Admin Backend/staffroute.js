const express = require('express');
const router = express.Router();
const staffController = require('./staffcontroller');

// ==================== STAFF ROUTES ====================

// Create new staff member
router.post('/staff', staffController.createStaff);

// Get all staff members
router.get('/staff', staffController.getAllStaff);

// Get staff statistics
router.get('/staff/stats', staffController.getStaffStats);

// Search staff members
router.get('/staff/search', staffController.searchStaff);

// Get single staff member by ID
router.get('/staff/:id', staffController.getStaffById);

// Update staff member
router.put('/staff/:id', staffController.updateStaff);

// Update staff status only
router.patch('/staff/:id/status', staffController.updateStaffStatus);

// Delete staff member
router.delete('/staff/:id', staffController.deleteStaff);

module.exports = router;