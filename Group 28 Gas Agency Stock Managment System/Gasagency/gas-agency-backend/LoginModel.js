const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  type: { type: String, required: true }, // Owner / Staff
  staffType: { type: String } // Official / Delivery
});

module.exports = mongoose.model("User", userSchema);