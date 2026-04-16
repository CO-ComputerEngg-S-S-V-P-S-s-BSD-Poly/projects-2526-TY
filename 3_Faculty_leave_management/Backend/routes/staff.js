// routes/staff.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// @GET /api/staff - Get all staff
router.get('/', protect, async (req, res) => {
  try {
    const staff = await User.find({ role: 'teacher' }).select('-password');
    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @GET /api/staff/:id - Get single staff
router.get('/:id', protect, async (req, res) => {
  try {
    const staff = await User.findById(req.params.id).select('-password');
    if (!staff) return res.status(404).json({ message: 'Staff not found' });
    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @POST /api/staff - Add new staff (admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  const { name, email, password, department, subject } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Staff already exists' });

    const staff = await User.create({
      name, email,
      password: password || 'staff123',
      role: 'teacher',
      department, subject
    });
    res.status(201).json({ id: staff._id, name: staff.name, email: staff.email, department: staff.department });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @PUT /api/staff/:id - Update staff (admin only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const staff = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @DELETE /api/staff/:id - Delete staff (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Staff removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
