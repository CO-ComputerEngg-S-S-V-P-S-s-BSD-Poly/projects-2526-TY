const express = require('express');
const router = express.Router();
const DataEntry = require('../models/DataEntry');

// Create a new data entry record
router.post('/', async (req, res) => {
  try {
    const record = new DataEntry(req.body);
    await record.save();
    res.status(201).json(record);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get a single record by ID
router.get('/item/:id', async (req, res) => {
  try {
    const record = await DataEntry.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all data entry records for a given year
router.get('/:year', async (req, res) => {
  try {
    const year = parseInt(req.params.year);
    if (isNaN(year)) {
      return res.status(400).json({ message: 'Invalid year parameter' });
    }
    const query = { year: year };
    if (req.query.discipline && req.query.discipline !== 'all') {
      query.discipline = req.query.discipline;
    }
    const records = await DataEntry.find(query).sort({ createdAt: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an existing record by ID
router.put('/:id', async (req, res) => {
  try {
    const record = await DataEntry.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }
    res.json(record);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a record by ID
router.delete('/:id', async (req, res) => {
  try {
    const record = await DataEntry.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }
    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
