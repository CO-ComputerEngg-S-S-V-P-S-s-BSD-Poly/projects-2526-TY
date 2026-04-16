const mongoose = require('mongoose');

const usageHistorySchema = new mongoose.Schema({
  materialId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Material',
    required: true,
  },
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Request',
  },
  supervisorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  quantityUsed: {
    type: Number,
    required: true,
    min: [1, 'Quantity used must be at least 1'],
  },
  issuedDate: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('UsageHistory', usageHistorySchema);
