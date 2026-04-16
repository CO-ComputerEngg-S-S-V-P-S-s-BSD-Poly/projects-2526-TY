// const Review = require("../models/ReviewModel");
// const Product = require("../models/Product");
// const multer  = require("multer");
// const path    = require("path");
// const fs      = require("fs");

// /* ─── Multer setup for review images ─── */
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const dir = "uploads/reviews";
//     if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
//     cb(null, dir);
//   },
//   filename: (req, file, cb) => {
//     const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, unique + path.extname(file.originalname));
//   },
// });
// const upload = multer({ storage });
// exports.uploadReviewImages = upload.fields([
//   { name: "customerImage", maxCount: 1 },
//   { name: "reviewImage",   maxCount: 1 },
// ]);

// /* ─────────────────────────────────────────────
//    POST /api/reviews
//    Customer submits a review for a product
// ───────────────────────────────────────────── */
// exports.createReview = async (req, res) => {
//   try {
//     const {
//       productId, customerName, customerEmail,
//       rating, title, body, recommended,
//     } = req.body;

//     if (!productId || !customerName || !customerEmail || !rating || !body) {
//       return res.status(400).json({ success: false, message: "Required fields missing" });
//     }

//     // Get product → find shopId & shopName
//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).json({ success: false, message: "Product not found" });
//     }

//     const customerImage = req.files?.customerImage?.[0]?.path || "";
//     const reviewImage   = req.files?.reviewImage?.[0]?.path   || "";

//     const review = await Review.create({
//       productId,
//       productName:   product.name,
//       shopId:        product.shopId,
//       shopName:      product.shopName,
//       customerName,
//       customerEmail,
//       rating:        Number(rating),
//       title:         title || "",
//       body,
//       customerImage,
//       reviewImage,
//       recommended:   recommended === "true" || recommended === true,
//     });

//     res.status(201).json({ success: true, review });
//   } catch (err) {
//     console.error("createReview error:", err);
//     res.status(500).json({ success: false, message: "Server error", error: err.message });
//   }
// };

// /* ─────────────────────────────────────────────
//    GET /api/reviews/product/:productId
//    Public — all reviews for one product
// ───────────────────────────────────────────── */
// exports.getReviewsByProduct = async (req, res) => {
//   try {
//     const reviews = await Review.find({ productId: req.params.productId })
//       .sort({ createdAt: -1 });

//     // Rating summary
//     const total  = reviews.length;
//     const avgRaw = total ? reviews.reduce((s, r) => s + r.rating, 0) / total : 0;
//     const avg    = Math.round(avgRaw * 10) / 10;

//     const breakdown = [5, 4, 3, 2, 1].map(star => ({
//       star,
//       count: reviews.filter(r => r.rating === star).length,
//     }));

//     res.json({ success: true, reviews, total, avg, breakdown });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Server error", error: err.message });
//   }
// };

// /* ─────────────────────────────────────────────
//    GET /api/reviews/shop/:shopId
//    Shopkeeper — only their own shop's reviews
// ───────────────────────────────────────────── */
// exports.getReviewsByShop = async (req, res) => {
//   try {
//     const reviews = await Review.find({ shopId: req.params.shopId })
//       .sort({ createdAt: -1 });

//     const total  = reviews.length;
//     const avgRaw = total ? reviews.reduce((s, r) => s + r.rating, 0) / total : 0;
//     const avg    = Math.round(avgRaw * 10) / 10;

//     const breakdown = [5, 4, 3, 2, 1].map(star => ({
//       star,
//       count: reviews.filter(r => r.rating === star).length,
//     }));

//     res.json({ success: true, reviews, total, avg, breakdown });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Server error", error: err.message });
//   }
// };

// /* ─────────────────────────────────────────────
//    GET /api/reviews/admin/all
//    Admin — all reviews from all shops
// ───────────────────────────────────────────── */
// exports.getAllReviewsAdmin = async (req, res) => {
//   try {
//     const reviews = await Review.find({}).sort({ createdAt: -1 });
//     res.json({ success: true, reviews, total: reviews.length });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Server error", error: err.message });
//   }
// };

// /* ─────────────────────────────────────────────
//    DELETE /api/reviews/:id
//    Shopkeeper deletes a review of their shop
// ───────────────────────────────────────────── */
// exports.deleteReview = async (req, res) => {
//   try {
//     const review = await Review.findById(req.params.id);
//     if (!review) {
//       return res.status(404).json({ success: false, message: "Review not found" });
//     }

//     // Delete uploaded images from disk
//     [review.customerImage, review.reviewImage].forEach(imgPath => {
//       if (imgPath && fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
//     });

//     await review.deleteOne();
//     res.json({ success: true, message: "Review deleted" });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Server error", error: err.message });
//   }
// };

// /* ─────────────────────────────────────────────
//    PUT /api/reviews/:id/helpful
//    Increment helpful count
// ───────────────────────────────────────────── */
// exports.markHelpful = async (req, res) => {
//   try {
//     const review = await Review.findByIdAndUpdate(
//       req.params.id,
//       { $inc: { helpful: 1 } },
//       { new: true }
//     );
//     res.json({ success: true, helpful: review.helpful });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };









const Review   = require("../models/ReviewModel");
const Product  = require("../models/Product");
const mongoose = require("mongoose");
const multer   = require("multer");
const path     = require("path");
const fs       = require("fs");

/* ─── Multer setup for review images ─── */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/reviews";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage });
exports.uploadReviewImages = upload.fields([
  { name: "customerImage", maxCount: 1 },
  { name: "reviewImage",   maxCount: 1 },
]);

/* ─────────────────────────────────────────────
   POST /api/reviews
   Customer submits a review for a product
───────────────────────────────────────────── */
exports.createReview = async (req, res) => {
  try {
    const {
      productId, customerName, customerEmail,
      rating, title, body, recommended,
    } = req.body;

    if (!productId || !customerName || !customerEmail || !rating || !body) {
      return res.status(400).json({ success: false, message: "Required fields missing" });
    }

    // Get product → find shopId & shopName
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const customerImage = req.files?.customerImage?.[0]?.path || "";
    const reviewImage   = req.files?.reviewImage?.[0]?.path   || "";

    const review = await Review.create({
      productId,
      productName:   product.name,
      shopId:        product.shopId,
      shopName:      product.shopName,
      customerName,
      customerEmail,
      rating:        Number(rating),
      title:         title || "",
      body,
      customerImage,
      reviewImage,
      recommended:   recommended === "true" || recommended === true,
    });

    res.status(201).json({ success: true, review });
  } catch (err) {
    console.error("createReview error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

/* ─────────────────────────────────────────────
   GET /api/reviews/product/:productId
   Public — all reviews for one product
───────────────────────────────────────────── */
exports.getReviewsByProduct = async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId })
      .sort({ createdAt: -1 });

    const total  = reviews.length;
    const avgRaw = total ? reviews.reduce((s, r) => s + r.rating, 0) / total : 0;
    const avg    = Math.round(avgRaw * 10) / 10;

    const breakdown = [5, 4, 3, 2, 1].map(star => ({
      star,
      count: reviews.filter(r => r.rating === star).length,
    }));

    res.json({ success: true, reviews, total, avg, breakdown });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

/* ─────────────────────────────────────────────
   GET /api/reviews/shop/:shopId
   Shopkeeper — only their own shop's reviews
   shopId = real MongoDB ObjectId  OR  demo_ string
   ?shopName=xyz query param bhi support karta hai
───────────────────────────────────────────── */
exports.getReviewsByShop = async (req, res) => {
  try {
    const { shopId }   = req.params;
    const { shopName } = req.query;   // frontend shopName bhi bhejta hai
    let reviews = [];

    if (mongoose.Types.ObjectId.isValid(shopId)) {
      // ── Real MongoDB ObjectId ──
      reviews = await Review.find({ shopId }).sort({ createdAt: -1 });
    } else if (shopName) {
      // ── demo_ ID hai — shopName se dhundho (query param) ──
      reviews = await Review.find({
        shopName: { $regex: new RegExp(`^${shopName}$`, "i") },
      }).sort({ createdAt: -1 });
    } else {
      // ── Fallback: shopId string se directly match karo ──
      reviews = await Review.find({ shopId: shopId }).sort({ createdAt: -1 });
    }

    const total  = reviews.length;
    const avgRaw = total ? reviews.reduce((s, r) => s + r.rating, 0) / total : 0;
    const avg    = Math.round(avgRaw * 10) / 10;

    const breakdown = [5, 4, 3, 2, 1].map(star => ({
      star,
      count: reviews.filter(r => r.rating === star).length,
    }));

    res.json({ success: true, reviews, total, avg, breakdown });
  } catch (err) {
    console.error("getReviewsByShop error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

/* ─────────────────────────────────────────────
   GET /api/reviews/admin/all
   Admin — all reviews from all shops
───────────────────────────────────────────── */
exports.getAllReviewsAdmin = async (req, res) => {
  try {
    const reviews = await Review.find({}).sort({ createdAt: -1 });
    res.json({ success: true, reviews, total: reviews.length });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

/* ─────────────────────────────────────────────
   DELETE /api/reviews/:id
   Shopkeeper deletes a review of their shop
───────────────────────────────────────────── */
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    // Delete uploaded images from disk
    [review.customerImage, review.reviewImage].forEach(imgPath => {
      if (imgPath && fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    });

    await review.deleteOne();
    res.json({ success: true, message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

/* ─────────────────────────────────────────────
   PUT /api/reviews/:id/helpful
   Increment helpful count
───────────────────────────────────────────── */
exports.markHelpful = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $inc: { helpful: 1 } },
      { new: true }
    );
    res.json({ success: true, helpful: review.helpful });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};