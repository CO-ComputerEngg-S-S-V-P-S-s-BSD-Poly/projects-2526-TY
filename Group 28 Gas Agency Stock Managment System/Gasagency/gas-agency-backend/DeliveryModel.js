const mongoose = require("mongoose");

// STAFF
const staffSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  area: String,
  status: { type: String, default: "Available" }
});

// ORDERS
const orderSchema = new mongoose.Schema({
  orderId: String,   // 👈 6 digit custom ID
  customer: String,
  area: String,
  cylinders: Number,
  type: String,
  status: { type: String, default: "Pending" }
});

// DELIVERY
const deliverySchema = new mongoose.Schema({
  orderId: String,   // 👈 SAME ID STORE HERE
  staff: String,
  customer: String,
  area: String,
  cylinders: Number,
  type: String,
  status: { type: String, default: "On Delivery" },
  date: String
});

const Staff = mongoose.model("Staff", staffSchema);
const Order = mongoose.model("Order", orderSchema);
const Delivery = mongoose.model("Delivery", deliverySchema);

module.exports = { Staff, Order, Delivery };