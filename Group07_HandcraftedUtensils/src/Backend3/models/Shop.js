const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema({
  shopName: { type: String, required: true },
  ownerName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  workingDays: [String],
  openingTime: String,
  closingTime: String,
  profileImage: String,
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  rejectionReason: String
}, { timestamps: true });

module.exports = mongoose.model("Shop", shopSchema);
