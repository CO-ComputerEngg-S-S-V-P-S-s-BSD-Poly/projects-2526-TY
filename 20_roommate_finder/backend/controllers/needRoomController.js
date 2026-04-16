const NeedRoom = require("../models/NeedRoom");
const NeedFlatmate = require("../models/NeedFlatmate");
const User = require("../models/User");

let needFlatmateNotifications = []; // Store NeedFlatmate notifications for NeedRoom users

// 📌 1️⃣ Post "Need a Room"
exports.postNeedRoom = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { location, lookingFor, rent, occupation,need, description } = req.body;

    const needRoom = new NeedRoom({
      userId: user._id,
      location,
      lookingFor,
      rent,
      occupation,
      need,
      description,
    });

    await needRoom.save();

    // 🔔 Notify NeedFlatmate users about this post
    needFlatmateNotifications.push({
      message: `New Need Room request posted by ${user.name} in ${location}.`,
      user: {
        name: user.name,
        gender: user.gender,
        city: user.city,
        profilePic: user.profilePic,
      },
      createdAt: new Date(),
    });

    res.status(201).json({ message: "Room requirement posted successfully", needRoom });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// 📌 2️⃣ Get All "Need a Flatmate" Posts (With Full User Details)
exports.getAllNeedFlatmatePosts = async (req, res) => {
  try {
    const needFlatmates = await NeedFlatmate.find()
      .populate("userId", "name mobile gender city profilePic")
      .sort({ createdAt: -1 });

    res.json(needFlatmates);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// 📌 3️⃣ Get Recent Notifications (With User Details)
exports.getNeedFlatmateNotifications = async (req, res) => {
  try {
    res.json({ message: "Recent NeedFlatmate notifications", notifications: needFlatmateNotifications });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// 📌 4️⃣ Match "Need a Room" with "Need a Flatmate" (With Match Percentage)
exports.matchNeedFlatmate = async (req, res) => {
  try {
    const { location, lookingFor, rent, occupation } = req.body;

    let query = {};
    if (location) query.location = location;
    if (lookingFor) query.lookingFor = { $in: [lookingFor, "Any"] };
    if (rent) query.rent = rent;
    if (occupation) query.occupation = { $in: [occupation, "Any"] };

    const matches = await NeedFlatmate.find(query).populate("userId", "name mobile gender city profilePic");

    if (matches.length === 0) {
      return res.json({ message: "No matching results found", matches: [] });
    }

    // ✅ Calculate Match Percentage
    const matchedResults = matches.map(match => {
      let matchPercentage = 0;
      if (location && match.location === location) matchPercentage += 25;
      if (lookingFor && (match.lookingFor === lookingFor || match.lookingFor === "Any")) matchPercentage += 25;
      if (rent && match.rent === rent) matchPercentage += 25;
      if (occupation && (match.occupation === occupation || match.occupation === "Any")) matchPercentage += 25;

      return { ...match.toObject(), matchPercentage };
    });

    res.json({ message: "Matching results found", matches: matchedResults });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
