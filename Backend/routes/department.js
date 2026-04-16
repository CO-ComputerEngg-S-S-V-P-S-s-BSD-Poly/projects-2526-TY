const express = require('express');
const router = express.Router();
const Department = require('../models/Department');
const auth = require('../middleware/authMiddleware'); // Admin check karne ke liye

// @route   GET api/departments
// @desc    Saare departments mangwane ke liye
router.get('/', async (req, res) => {
  try {
    const depts = await Department.find();
    res.json(depts);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   POST api/departments
// @desc    Naya department add karne ke liye (Sirf Admin)
router.post('/', auth, async (req, res) => {
  try {
    const { name, description } = req.body;
    let dept = new Department({ name, description });
    await dept.save();
    res.json(dept);
  } catch (err) {
    res.status(500).send('Saving Error');
  }
});
// Delete department
router.delete('/:id', auth, async (req, res) => {
    try {
        await Department.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Department deleted' });
    } catch (err) {
        res.status(500).send('Error deleting');
    }
});
router.put('/assign/:id', auth, async (req, res) => {
    try {
        const { departmentId } = req.body;
        const complaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            { department: departmentId },
            { new: true }
        ).populate('department');
        
        res.json(complaint);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;