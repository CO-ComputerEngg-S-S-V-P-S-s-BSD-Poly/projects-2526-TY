const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  customerId: String,
  name: String,
  mobile: String,
  address: String,
  date: String
});

module.exports = mongoose.model("Customer", customerSchema);