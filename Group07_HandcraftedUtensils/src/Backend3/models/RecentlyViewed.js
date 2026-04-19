// ============================================
// FILE: backend/models/RecentlyViewed.js
// COMPLETE MONGODB MODEL
// ============================================

const mongoose = require('mongoose');

const recentlyViewedSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  products: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    viewedAt: {
      type: Date,
      default: Date.now
    }
  }],
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create indexes for faster queries
recentlyViewedSchema.index({ userId: 1 });
recentlyViewedSchema.index({ 'products.viewedAt': -1 });

// Update the updatedAt field before saving
recentlyViewedSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const RecentlyViewed = mongoose.model('RecentlyViewed', recentlyViewedSchema);

module.exports = RecentlyViewed;