// models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  type: { type: String, required: true },
  message: { type: String, required: true },
  toTeacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  toTeacherName: { type: String },
  leaveRequestId: { type: mongoose.Schema.Types.ObjectId, ref: 'LeaveRequest' },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] },
  read: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
