const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gender: { type: String, enum: ["Male", "Female"], required: true },
  city: { type: String, enum: ["Pune", "Mumbai", "Nagpur", "Nashik", "Aurangabad"], required: true },
  mobile: { type: String, required: true, unique: true },
  profilePic: { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
