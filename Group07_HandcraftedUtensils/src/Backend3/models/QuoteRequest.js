// const mongoose = require("mongoose");

// const quoteRequestSchema = new mongoose.Schema(
//   {
//     // Customer info
//     customerName: {
//       type: String,
//       required: [true, "Customer name is required"],
//       trim: true,
//     },
//     customerEmail: {
//       type: String,
//       required: [true, "Email is required"],
//       trim: true,
//       lowercase: true,
//     },
//     customerPhone: {
//       type: String,
//       required: [true, "Phone number is required"],
//       trim: true,
//     },

//     // Product/Service info
//     productName: {
//       type: String,
//       required: [true, "Product name is required"],
//       trim: true,
//     },
//     description: {
//       type: String,
//       trim: true,
//     },
//     quantity: {
//       type: Number,
//       default: 1,
//       min: 1,
//     },
//     budget: {
//       type: String, // e.g. "5000-10000" or "flexible"
//       trim: true,
//     },

//     // Which shop this quote is for
//     shopId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Shop",
//       required: [true, "Shop ID is required"],
//     },

//     // Shopkeeper's response
//     status: {
//       type: String,
//       enum: ["pending", "approved", "rejected", "quoted"],
//       default: "pending",
//     },
//     shopkeeperNote: {
//       type: String,
//       trim: true,
//     },
//     quotedPrice: {
//       type: Number,
//       default: null,
//     },

//     // Was customer notified?
//     customerNotified: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("QuoteRequest", quoteRequestSchema);


const mongoose = require("mongoose");

const quoteRequestSchema = new mongoose.Schema(
  {
    // Customer info
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
    },
    customerEmail: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    customerPhone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },

    // Product/Service info
    productName: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },
    budget: {
      type: String,
      trim: true,
    },

    // ✅ FIX: ObjectId ki jagah String rakha — demo mode ke liye
    shopId: {
      type: String,
      required: [true, "Shop ID is required"],
    },

    // Shopkeeper's response
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "quoted"],
      default: "pending",
    },
    shopkeeperNote: {
      type: String,
      trim: true,
    },
    quotedPrice: {
      type: Number,
      default: null,
    },

    // Was customer notified?
    customerNotified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("QuoteRequest", quoteRequestSchema);