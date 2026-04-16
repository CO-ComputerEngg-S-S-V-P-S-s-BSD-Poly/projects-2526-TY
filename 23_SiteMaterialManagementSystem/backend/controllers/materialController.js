const Material = require('../models/Material');

// ─── Add Material (Admin) ──────────────────────────────────────────────────────
// POST /api/material
const addMaterial = async (req, res) => {
  try {
    const { name, category, quantity, unit, pricePerUnit, threshold } = req.body;

    if (!name || !category || quantity === undefined || !unit || !pricePerUnit) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const material = await Material.create({
      name,
      category,
      quantity,
      unit,
      pricePerUnit,
      threshold: threshold || 50,
    });

    res.status(201).json({ message: 'Material added successfully', material });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── Get All Materials ────────────────────────────────────────────────────────
// GET /api/materials
const getAllMaterials = async (req, res) => {
  try {
    const materials = await Material.find().sort({ createdAt: -1 });
    res.status(200).json(materials);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── Get Single Material ──────────────────────────────────────────────────────
// GET /api/material/:id
const getMaterialById = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }
    res.status(200).json(material);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── Update Material (Admin) ──────────────────────────────────────────────────
// PUT /api/material/:id
const updateMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    const updatedMaterial = await Material.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({ message: 'Material updated successfully', material: updatedMaterial });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── Delete Material (Admin) ──────────────────────────────────────────────────
// DELETE /api/material/:id
const deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    await Material.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Material deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── Get Low Stock Materials ──────────────────────────────────────────────────
// GET /api/materials/low-stock
const getLowStockMaterials = async (req, res) => {
  try {
    const materials = await Material.find({
      $expr: { $lt: ['$quantity', '$threshold'] }
    });
    res.status(200).json(materials);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  addMaterial,
  getAllMaterials,
  getMaterialById,
  updateMaterial,
  deleteMaterial,
  getLowStockMaterials,
};
