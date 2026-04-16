const express = require("express");
const router  = express.Router();
const ctrl = require("../controllers/ReviewController");

// POST   /api/reviews              → customer submits review (with images)
router.post("/", ctrl.uploadReviewImages, ctrl.createReview);

// GET    /api/reviews/product/:id  → all reviews for a product (public / ProductDetail page)
router.get("/product/:productId", ctrl.getReviewsByProduct);

// GET    /api/reviews/shop/:shopId → reviews for shopkeeper's own shop
router.get("/shop/:shopId", ctrl.getReviewsByShop);

// GET    /api/reviews/admin/all    → all reviews (admin dashboard)
router.get("/admin/all", ctrl.getAllReviewsAdmin);

// DELETE /api/reviews/:id          → shopkeeper deletes a review
router.delete("/:id", ctrl.deleteReview);

// PUT    /api/reviews/:id/helpful  → mark helpful
router.put("/:id/helpful", ctrl.markHelpful);

module.exports = router;