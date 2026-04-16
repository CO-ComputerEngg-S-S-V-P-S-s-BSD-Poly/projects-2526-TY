const Preference = require("../models/Preference");
const NeedRoom = require("../models/NeedRoom");
const NeedFlatmate = require("../models/NeedFlatmate");
const User = require("../models/User");

// ✅ 1. Save User Preferences (At least 3 required)
exports.postPreference = async (req, res) => {
  try {
    const { vegetarian, student, job, nonAlcoholic, gym, nightOwl, earlyBird, sporty, traveller, partyLover, petLover, musicLover } = req.body;

    if ([vegetarian, student, job, nonAlcoholic, gym, nightOwl, earlyBird, sporty, traveller, partyLover, petLover, musicLover].filter(Boolean).length < 3) {
      return res.status(400).json({ message: "At least 3 preferences are required." });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found. Please register first." });
    }

    let preference = await Preference.findOne({ userId: user._id });

    if (preference) {
      preference.vegetarian = vegetarian;
      preference.student = student;
      preference.job = job;
      preference.nonAlcoholic = nonAlcoholic;
      preference.gym = gym;
      preference.nightOwl = nightOwl;
      preference.earlyBird = earlyBird;
      preference.sporty = sporty;
      preference.traveller = traveller;
      preference.partyLover = partyLover;
      preference.petLover = petLover;
      preference.musicLover =  musicLover;

    } else {
      preference = new Preference({
        userId: user._id,
        vegetarian,
        student,
        job,
        nonAlcoholic,
        gym,
        nightOwl,
        earlyBird,
        sporty,
        traveller,
        partyLover,
        petLover,
        musicLover
      });
    }

    await preference.save();
    res.status(201).json({ message: "Preferences saved successfully", preference });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ 2. Get User Preferences
exports.getPreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const preferences = await Preference.findOne({ userId: user._id });

    if (!preferences) {
      return res.status(404).json({ message: "Preferences not found" });
    }

    res.json(preferences);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ 3. Match NeedRoom Posts Based on Preferences
exports.matchNeedRoom = async (req, res) => {
  try {
    const userPreferences = await Preference.findOne({ userId: req.user.id });
    if (!userPreferences) {
      return res.status(404).json({ message: "No preferences found. Please set preferences first." });
    }

    const matches = await NeedRoom.find().populate("userId", "name mobile gender city profilePic");

    const filteredMatches = matches.map((room) => {
      let matchedPreferences = [];
      if (userPreferences.vegetarian && room.vegetarian) matchedPreferences.push("Vegetarian");
      if (userPreferences.student && room.student) matchedPreferences.push("Student");
      if (userPreferences.job && room.job) matchedPreferences.push("Job");
      if (userPreferences.nonAlcoholic && room.nonAlcoholic) matchedPreferences.push("Non-Alcoholic");
      if (userPreferences.gym && room.gym) matchedPreferences.push("Gym");
       
      if (userPreferences.nightOwl && room.nightOwl) matchedPreferences.push("Night Owl");
      if (userPreferences.earlyBird && room.earlyBird) matchedPreferences.push("Early Bird");
      if (userPreferences.sporty && room.sporty) matchedPreferences.push("Sporty");
      if (userPreferences.traveller && room.traveller) matchedPreferences.push("Traveller");
      if (userPreferences.partyLover && room.partyLover) matchedPreferences.push("Party Lover");
      if (userPreferences.petLover && room.petLover) matchedPreferences.push("Pet Lover");
      if (userPreferences.musicLover && room.musicLover) matchedPreferences.push("Music Lover");
      return matchedPreferences.length > 0
        ? { ...room.toObject(), matchedPreferences }
        : null;
    }).filter(Boolean);

    if (filteredMatches.length === 0) {
      return res.json({ message: "No matching results found", matches: [] });
    }

    res.json({ message: "Matching results found", matches: filteredMatches });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ 4. Match NeedFlatmate Posts Based on Preferences
exports.matchNeedFlatmate = async (req, res) => {
  try {
    const userPreferences = await Preference.findOne({ userId: req.user.id });
    if (!userPreferences) {
      return res.status(404).json({ message: "No preferences found. Please set preferences first." });
    }

    const matches = await NeedFlatmate.find().populate("userId", "name mobile gender city profilePic");

    const filteredMatches = matches.map((flatmate) => {
      let matchedPreferences = [];
      if (userPreferences.vegetarian && flatmate.vegetarian) matchedPreferences.push("Vegetarian");
      if (userPreferences.student && flatmate.student) matchedPreferences.push("Student");
      if (userPreferences.job && flatmate.job) matchedPreferences.push("Job");
      if (userPreferences.nonAlcoholic && flatmate.nonAlcoholic) matchedPreferences.push("Non-Alcoholic");
      if (userPreferences.gym && flatmate.gym) matchedPreferences.push("Gym");
     
      if (userPreferences.nightOwl && flatmate.nightOwl) matchedPreferences.push("Night Owl");
      if (userPreferences.earlyBird && flatmate.earlyBird) matchedPreferences.push("Early Bird");
      if (userPreferences.sporty && flatmate.sporty) matchedPreferences.push("Sporty");
      if (userPreferences.traveller && flatmate.traveller) matchedPreferences.push("Traveller");
      if (userPreferences.partyLover && flatmate.partyLover) matchedPreferences.push("Party Lover");
      if (userPreferences.petLover && flatmate.petLover) matchedPreferences.push("Pet Lover");
      if (userPreferences.musicLover && flatmate.musicLover) matchedPreferences.push("Music Lover");

      return matchedPreferences.length > 0
        ? { ...flatmate.toObject(), matchedPreferences }
        : null;
    }).filter(Boolean);

    if (filteredMatches.length === 0) {
      return res.json({ message: "No matching results found", matches: [] });
    }

    res.json({ message: "Matching results found", matches: filteredMatches });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
