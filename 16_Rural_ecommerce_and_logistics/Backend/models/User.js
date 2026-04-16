const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["customer", "artisan", "admin"],
      default: "customer",
    },

    village: {
      type: String,
    },

    craftType: {
      type: String,
    },

    isApproved: {
      type: Boolean,
      default: false, // Artisan approval ke liye
    },

    // 🔥 NEW FIELD – Seller Earnings
    earnings: {
      type: Number,
      default: 0,
    },

    // 🔥 Optional – Total Orders Count
    totalOrders: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
