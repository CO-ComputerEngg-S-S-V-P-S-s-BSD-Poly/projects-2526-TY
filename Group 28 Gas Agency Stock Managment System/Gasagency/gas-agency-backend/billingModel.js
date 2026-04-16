const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
  billNo: String,
  customerId: String,
  customerName: String,
  mobile: Number,
  date: String,
  gasType: String,
  quantity: Number,
  amount: Number,
  address: String
});

module.exports = mongoose.model("Bill", billSchema);