const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

// POST: Save Feedback
router.post('/', async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const newFeedback = new Feedback({
      rating,
      comment
    });
    await newFeedback.save();
    res.status(201).json({ msg: "Feedback saved successfully" });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});
// routes/feedback.js mein ye bhi add karein
router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;