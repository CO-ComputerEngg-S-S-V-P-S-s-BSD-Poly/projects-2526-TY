const express = require('express');
const router = express.Router();
const bedController = require('./bedcontroller');

// ==================== BED ROUTES ====================

// Create new bed
router.post('/beds', bedController.createBed);

// Get all beds (with optional filters)
router.get('/beds', bedController.getAllBeds);

// Get bed statistics
router.get('/beds/stats', bedController.getBedStats);

// Search beds
router.get('/beds/search', bedController.searchBeds);

// Get single bed by ID
router.get('/beds/:id', bedController.getBedById);

// Update bed
router.put('/beds/:id', bedController.updateBed);

// Update bed status only
router.patch('/beds/:id/status', bedController.updateBedStatus);

// Delete bed
router.delete('/beds/:id', bedController.deleteBed);

module.exports = router;