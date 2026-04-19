// const mongoose = require("mongoose");

// const reviewSchema = new mongoose.Schema(
//   {
//     // Which product was reviewed
//     productId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Product",
//       required: true,
//     },
//     productName: { type: String, required: true },

//     // Which shop this product belongs to
//     shopId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Shop",
//       required: false,   // ← ONLY this line changed (was: required: true)
//       default: null,
//     },
//     shopName: { type: String, default: "" },  // ← ONLY this line changed (was: required: true)

//     // Customer info
//     customerName:     { type: String, required: true },
//     customerEmail:    { type: String, required: true },
//     customerLocation: { type: String, default: "India" },

//     // Review content
//     rating: { type: Number, required: true, min: 1, max: 5 },
//     title:  { type: String, default: "" },
//     body:   { type: String, required: true },

//     // Images
//     customerImage: { type: String, default: "" },
//     reviewImage:   { type: String, default: "" },

//     // Extra
//     recommended: { type: Boolean, default: false },
//     helpful:     { type: Number,  default: 0 },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Review", reviewSchema);





const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    // Which product was reviewed
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productName: { type: String, required: true },

    // Which shop this product belongs to
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: false,   // ← ONLY this line changed (was: required: true)
      default: null,
    },
    shopName: { type: String, default: "" },  // ← ONLY this line changed (was: required: true)

    // Customer info
    customerName:     { type: String, required: true },
    customerEmail:    { type: String, required: true },
    customerLocation: { type: String, default: "India" },

    // Review content
    rating: { type: Number, required: true, min: 1, max: 5 },
    title:  { type: String, default: "" },
    body:   { type: String, required: true },

    // Images
    customerImage: { type: String, default: "" },
    reviewImage:   { type: String, default: "" },

    // Extra
    recommended: { type: Boolean, default: false },
    helpful:     { type: Number,  default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);