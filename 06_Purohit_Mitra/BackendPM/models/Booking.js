// const mongoose = require("mongoose");

// const bookingSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//   },
//   pandit: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "pandit",
//   },
//   pujaSlug: {
//     type: String,
//   },
//   date: {
//   type: String,
//   required: true
// },
// time: {
//   type: String,
//   required: true
// },
//   status: {
//     type: String,
//     default: "Pending",
//   },
//   price: Number, 
//   date: {
//     type: Date,
//     default: Date.now
//   }
  
// });

// module.exports = mongoose.model("Booking", bookingSchema);



const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  pandit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "pandit",
  },
  pujaSlug: String,

  date: {
    type: String,
    required: true
  },

  time: {
    type: String,
    required: true
  },

  status: {
    type: String,
    default: "Pending",
  },

  price: Number,

  // 🔥 ADD THESE
  name: String,
  address: String,
  phone: String

}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);