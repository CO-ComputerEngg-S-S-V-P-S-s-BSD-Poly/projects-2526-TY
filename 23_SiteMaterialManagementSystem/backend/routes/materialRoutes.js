const express = require('express');
const router = express.Router();
const {
  addMaterial,
  getAllMaterials,
  getMaterialById,
  updateMaterial,
  deleteMaterial,
  getLowStockMaterials,
} = require('../controllers/materialController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

router.post('/material', adminOnly, addMaterial);
router.get('/materials', getAllMaterials);
router.get('/materials/low-stock', getLowStockMaterials);
router.get('/material/:id', getMaterialById);
router.put('/material/:id', adminOnly, updateMaterial);
router.delete('/material/:id', adminOnly, deleteMaterial);

module.exports = router;
