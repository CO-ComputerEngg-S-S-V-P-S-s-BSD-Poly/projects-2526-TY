// models/LeaveRequest.js
const mongoose = require('mongoose');

const substituteSchema = new mongoose.Schema({
  date: String,
  day: String,
  period: Number,
  class: String,
  time: String,
  freeTeachers: [{ 
    id: String,  // ✅ Number → String (MongoDB ObjectId string hai)
    name: String 
  }],
  assignedTeacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  acceptedByName: { type: String, default: null },
  subStatus: { type: String, enum: ['pending', 'accepted'], default: 'pending' },
});

const leaveRequestSchema = new mongoose.Schema({
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  teacherName: { type: String, required: true },
  facultyName: { type: String },
  department: { type: String },
  leaveType: { type: String, enum: ['medical', 'casual', 'duty', 'personal'], required: true },
  fromDate: { type: String, required: true },
  toDate: { type: String, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  substituteRequests: [substituteSchema],
}, { timestamps: true });

module.exports = mongoose.model('LeaveRequest', leaveRequestSchema);