const mongoose = require("mongoose");

const PreferenceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  vegetarian: { type: Boolean, default: false },
  student: { type: Boolean, default: false },
  job: { type: Boolean, default: false },
  nonAlcoholic: { type: Boolean, default: false },
  gym: { type: Boolean, default: false },
  nightOwl: { type: Boolean, default: false },
  earlyBird: { type: Boolean, default: false },
  sporty: { type: Boolean, default: false },
  traveller: { type: Boolean, default: false },
  partyLover: { type: Boolean, default: false },
  petLover: { type: Boolean, default: false },
  musicLover: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Preference", PreferenceSchema);
