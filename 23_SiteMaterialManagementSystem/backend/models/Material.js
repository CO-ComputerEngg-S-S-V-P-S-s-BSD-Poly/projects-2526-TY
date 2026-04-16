const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Material name is required'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Cement', 'Sand', 'Steel', 'Bricks', 'Aggregate', 'Paint', 'Wood', 'Other'],
    default: 'Other',
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative'],
    default: 0,
  },
  unit: {
    type: String,
    required: [true, 'Unit is required'],
    enum: ['kg', 'ton', 'litre', 'piece', 'bag', 'cubic meter', 'meter'],
  },
  pricePerUnit: {
    type: Number,
    required: [true, 'Price per unit is required'],
    min: [0, 'Price cannot be negative'],
  },
  threshold: {
    type: Number,
    required: [true, 'Threshold is required'],
    default: 50,
    min: [0, 'Threshold cannot be negative'],
  },
}, { timestamps: true });

module.exports = mongoose.model('Material', materialSchema);
