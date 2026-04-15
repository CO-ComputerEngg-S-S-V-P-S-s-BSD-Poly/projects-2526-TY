const mongoose = require("mongoose")

const panditSchema = mongoose.Schema({
name: String,
email: String,
password: String,
MobileNo: Number,
image: String,
experience: String,

specialization: [
  {
    name: String,
    price: Number
  }
],

address: String,

role: {
  type: String,
  default: "pandit"
}
})

module.exports = mongoose.model('pandit', panditSchema)