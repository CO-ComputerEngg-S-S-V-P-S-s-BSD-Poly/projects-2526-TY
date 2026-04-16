const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // ================= CUSTOMER =================
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ================= ORDER ITEMS =================
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
          default: 1,
        },

        price: {
          type: Number,
          required: true,
        },

        // 🔥 Artisan reference (VERY IMPORTANT)
        artisan: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },

        // 🔥 Per item total (price × quantity)
        itemTotal: {
          type: Number,
          required: true,
        },
      },
    ],

    // ================= AMOUNT DETAILS =================
    totalAmount: {
      type: Number,
      required: true,
    },

    // 🔥 Admin commission (10%)
    adminCommission: {
      type: Number,
      default: 0,
    },

    // 🔥 Total artisan earning (after commission)
    artisanEarning: {
      type: Number,
      default: 0,
    },

    // ================= PAYMENT DETAILS =================
    paymentMethod: {
      type: String,
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },

    // ================= ORDER STATUS =================
    status: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },

    cancelReason: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
