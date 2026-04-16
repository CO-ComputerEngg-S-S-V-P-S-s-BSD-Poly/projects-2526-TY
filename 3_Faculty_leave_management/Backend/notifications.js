// routes/notifications.js
const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { protect } = require('../middleware/auth');

// @GET /api/notifications - Get my notifications
router.get('/', protect, async (req, res) => {
  try {
    const notifications = await Notification.find({ toTeacherId: req.user._id })
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @PUT /api/notifications/:id/read - Mark as read
router.put('/:id/read', protect, async (req, res) => {
  try {
    const notif = await Notification.findByIdAndUpdate(
      req.params.id, { read: true }, { new: true }
    );
    res.json(notif);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @PUT /api/notifications/read-all - Mark all as read
router.put('/read-all', protect, async (req, res) => {
  try {
    await Notification.updateMany({ toTeacherId: req.user._id }, { read: true });
    res.json({ message: 'All marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
