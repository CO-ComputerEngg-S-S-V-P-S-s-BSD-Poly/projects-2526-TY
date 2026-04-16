const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  customer: { type: String, required: true },
  area: { type: String },
  staff: { type: String },
  cylinders: { type: Number, default: 2 },      // main stock
  emptyCylinders: { type: Number, default: 0 },
   address: String,   // empty cylinders
  status: { type: String, default: "Pending" }
});

module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);