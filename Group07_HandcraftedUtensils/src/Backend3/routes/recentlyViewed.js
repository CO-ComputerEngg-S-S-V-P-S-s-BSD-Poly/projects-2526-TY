// ============================================
// FILE: backend/routes/recentlyViewed.js
// COMPLETE API ROUTES
// ============================================

const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const RecentlyViewed = require('../models/RecentlyViewed');

// ============================================
// GET RELATED PRODUCTS (Similar Products)
// Route: GET /api/products/:productId/related
// ============================================
router.get('/api/products/:productId/related', async (req, res) => {
  try {
    const { productId } = req.params;
    const limit = parseInt(req.query.limit) || 6;

    // Get the current product to find its category
    const currentProduct = await Product.findById(productId);
    
    if (!currentProduct) {
      return res.status(404).json({ 
        success: false,
        error: 'Product not found' 
      });
    }

    // Find similar products from the same category, excluding current product
    const relatedProducts = await Product.find({
      _id: { $ne: productId },
      category: currentProduct.category,
      inStock: true
    })
    .limit(limit)
    .select('_id name price oldPrice image category rating reviews inStock shop shopName')
    .sort({ rating: -1, reviews: -1 }); // Sort by popularity

    res.json({
      success: true,
      count: relatedProducts.length,
      products: relatedProducts
    });

  } catch (error) {
    console.error('Error fetching related products:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error while fetching related products' 
    });
  }
});

// ============================================
// SAVE RECENTLY VIEWED PRODUCT
// Route: POST /api/recently-viewed
// ============================================
router.post('/api/recently-viewed', async (req, res) => {
  try {
    const { productId, userId } = req.body;

    if (!productId) {
      return res.status(400).json({ 
        success: false,
        error: 'Product ID is required' 
      });
    }

    // If user is logged in, save to database
    if (userId) {
      // Find or create user's recently viewed collection
      let recentlyViewed = await RecentlyViewed.findOne({ userId });

      if (!recentlyViewed) {
        recentlyViewed = new RecentlyViewed({
          userId,
          products: []
        });
      }

      // Remove product if already exists (to move it to front)
      recentlyViewed.products = recentlyViewed.products.filter(
        p => p.productId.toString() !== productId
      );

      // Add product to front of array
      recentlyViewed.products.unshift({
        productId,
        viewedAt: new Date()
      });

      // Keep only last 20 viewed products
      recentlyViewed.products = recentlyViewed.products.slice(0, 20);

      await recentlyViewed.save();

      // Populate product details
      const populated = await RecentlyViewed.findById(recentlyViewed._id)
        .populate({
          path: 'products.productId',
          select: '_id name price oldPrice image category rating reviews inStock shop shopName'
        });

      res.json({ 
        success: true, 
        message: 'Product saved to recently viewed',
        recentlyViewed: populated.products.map(p => p.productId).filter(p => p !== null)
      });
    } else {
      // For guest users, just return success (they'll use localStorage)
      res.json({ 
        success: true,
        message: 'Guest user - using localStorage' 
      });
    }

  } catch (error) {
    console.error('Error saving recently viewed:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error while saving recently viewed' 
    });
  }
});

// ============================================
// GET RECENTLY VIEWED PRODUCTS (Logged-in User)
// Route: GET /api/recently-viewed/:userId
// ============================================
router.get('/api/recently-viewed/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit) || 12;

    const recentlyViewed = await RecentlyViewed.findOne({ userId })
      .populate({
        path: 'products.productId',
        select: '_id name price oldPrice image category rating reviews inStock shop shopName'
      });

    if (!recentlyViewed) {
      return res.json({
        success: true,
        count: 0,
        products: []
      });
    }

    const products = recentlyViewed.products
      .map(p => p.productId)
      .filter(p => p !== null) // Filter out deleted products
      .slice(0, limit);

    res.json({
      success: true,
      count: products.length,
      products: products
    });

  } catch (error) {
    console.error('Error fetching recently viewed:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error while fetching recently viewed' 
    });
  }
});

// ============================================
// GET RECENTLY VIEWED BY PRODUCT IDS (Guest Users)
// Route: POST /api/recently-viewed/bulk
// ============================================
router.post('/api/recently-viewed/bulk', async (req, res) => {
  try {
    const { productIds } = req.body;
    const limit = parseInt(req.query.limit) || 12;

    if (!productIds || !Array.isArray(productIds)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid product IDs array' 
      });
    }

    if (productIds.length === 0) {
      return res.json({
        success: true,
        count: 0,
        products: []
      });
    }

    const products = await Product.find({
      _id: { $in: productIds }
    })
    .select('_id name price oldPrice image category rating reviews inStock shop shopName')
    .limit(limit);

    // Maintain the order of productIds
    const orderedProducts = productIds
      .map(id => products.find(p => p._id.toString() === id))
      .filter(p => p !== undefined)
      .slice(0, limit);

    res.json({
      success: true,
      count: orderedProducts.length,
      products: orderedProducts
    });

  } catch (error) {
    console.error('Error fetching products by IDs:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error while fetching products' 
    });
  }
});

// ============================================
// DELETE RECENTLY VIEWED HISTORY
// Route: DELETE /api/recently-viewed/:userId
// ============================================
router.delete('/api/recently-viewed/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    await RecentlyViewed.findOneAndDelete({ userId });

    res.json({ 
      success: true,
      message: 'Recently viewed history cleared' 
    });

  } catch (error) {
    console.error('Error clearing recently viewed:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error while clearing history' 
    });
  }
});

module.exports = router;