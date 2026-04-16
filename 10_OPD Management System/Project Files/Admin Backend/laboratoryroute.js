const express = require('express');
const router = express.Router();
const labController = require('./laboratorycontroller');
const { authenticateToken, authorizeRoles } = require('./authmiddleware');

// ==================== LABORATORY ROUTES ====================

// Public routes (no authentication required for now)
// In production, uncomment authenticateToken

// Create new lab test
router.post('/laboratory', labController.createLabTest);

// Get all lab tests
router.get('/laboratory', labController.getAllLabTests);

// Get lab statistics
router.get('/laboratory/stats', labController.getLabStats);

// Search lab tests
router.get('/laboratory/search', labController.searchLabTests);

// Get single lab test by ID
router.get('/laboratory/:id', labController.getLabTestById);

// Update lab test
router.put('/laboratory/:id', labController.updateLabTest);

// Update test results only
router.patch('/laboratory/:id/results', labController.updateTestResults);

// Update test status only
router.patch('/laboratory/:id/status', labController.updateTestStatus);

// Delete lab test
router.delete('/laboratory/:id', labController.deleteLabTest);

// Protected routes (with authentication)
// router.post('/laboratory', authenticateToken, labController.createLabTest);
// router.put('/laboratory/:id', authenticateToken, labController.updateLabTest);
// router.delete('/laboratory/:id', authenticateToken, authorizeRoles('Admin', 'Lab Technician'), labController.deleteLabTest);

module.exports = router;