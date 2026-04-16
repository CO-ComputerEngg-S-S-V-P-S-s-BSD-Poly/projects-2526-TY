// const mongoose = require("mongoose");

// const UserSchema = new mongoose.Schema({
//   name: String,
//   email: { type: String, unique: true },
//   password: String,
//   role: {
//     type: String,
//     enum: ["pandit", "user"],
//     required: true
//   }
// });

// module.exports = mongoose.model("User", UserSchema);

// ############################################

// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   role: {
//     type: String,
//     default: "user",
//   }
// }, { timestamps: true });


// // Password hash before saving
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     next();
//   }

//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });


// // Password compare function
// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// module.exports = mongoose.model("User", userSchema);
// #################################################################

// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//   name: String,
//   email: String,
//   password: String
// });

// const User = mongoose.model("User", userSchema);

// export default User;







const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
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
    default: "user",
  },
  // ========== ADD THESE 3 FIELDS ==========
  isActive: {
    type: Boolean,
    default: false, // User inactive by default
  },
  lastLogin: {
    type: Date,
  },
  lastLogout: {
    type: Date,
  }
  // =========================================
}, { timestamps: true });


// Password hash before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


// Password compare function
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);