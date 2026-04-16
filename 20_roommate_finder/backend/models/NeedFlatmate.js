const mongoose = require("mongoose");

const NeedFlatmateSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  location: { 
    type: String, 
    enum: ["Pune", "Mumbai", "Nagpur", "Nashik", "Aurangabad"], 
    required: true 
  },
  lookingFor: { 
    type: String, 
    enum: ["Male", "Female", "Any"], 
    required: true 
  },
  rent: { 
    type: Number, 
    enum: [2000, 4000, 6000, 8000, 10000], 
    required: true 
  },
  occupation: { 
    type: String, 
    enum: ["Single", "Sharing", "Any"], 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  need: { 
    type: String, 
    required: true 
  },
  flatPic: { 
    type: String, 
    default: "" 
  }
}, { timestamps: true });

module.exports = mongoose.model("NeedFlatmate", NeedFlatmateSchema);
