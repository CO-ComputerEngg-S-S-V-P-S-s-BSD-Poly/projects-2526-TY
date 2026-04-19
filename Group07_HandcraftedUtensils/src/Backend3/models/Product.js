const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    price:       { type: Number, required: true },
    stockQty:    { type: Number, default: 0 },
    description: { type: String, default: "" },
    material:    { type: String, default: "" },
    weight:      { type: String, default: "" },
    category:    { type: String, required: true },

    // Shop info
    shopId:    { type: mongoose.Schema.Types.ObjectId, ref: "Shop" },
    shopName:  { type: String, required: true },
    ownerName: { type: String, default: "" },

    // Product image path
    image: { type: String, default: "" },

    // Frontend display fields
    rating:  { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);