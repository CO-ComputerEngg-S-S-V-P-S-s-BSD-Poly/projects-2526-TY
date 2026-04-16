const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Kisne ki?
  category: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String }, // Image ka file path
  status: { type: String, default: 'Pending' }, // Pending, In Progress, Resolved
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department' // Ensure karein ki ye naam aapke Department model se match kare
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Complaint', ComplaintSchema);