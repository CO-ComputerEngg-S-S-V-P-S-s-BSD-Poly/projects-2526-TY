const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema({

user: {
type: mongoose.Schema.Types.ObjectId,
ref: "User"
},

pandit: {
type: mongoose.Schema.Types.ObjectId,
ref: "pandit"
},

booking: {
type: mongoose.Schema.Types.ObjectId,
ref: "Booking"
},

rating: {
type: Number,
min: 1,
max: 5
},

comment: String

}, { timestamps: true })

module.exports = mongoose.model("Review", reviewSchema)