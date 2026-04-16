const express = require('express');
const router = express.Router();
const machineryController = require('./machinerycontroller');
const { authenticateToken, authorizeRoles } = require('./authmiddleware');

// ==================== MACHINERY ROUTES ====================

// Create new equipment
router.post('/machinery', machineryController.createMachinery);

// Get all equipment
router.get('/machinery', machineryController.getAllMachinery);

// Get equipment statistics
router.get('/machinery/stats', machineryController.getMachineryStats);

// Search equipment
router.get('/machinery/search', machineryController.searchMachinery);

// Get single equipment by ID
router.get('/machinery/:id', machineryController.getMachineryById);

// Update equipment
router.put('/machinery/:id', machineryController.updateMachinery);

// Update service record
router.patch('/machinery/:id/service', machineryController.updateServiceRecord);

// Update status only
router.patch('/machinery/:id/status', machineryController.updateStatus);

// Delete equipment
router.delete('/machinery/:id', machineryController.deleteMachinery);

module.exports = router;