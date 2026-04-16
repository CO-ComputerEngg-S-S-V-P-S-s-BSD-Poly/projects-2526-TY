const NeedFlatmate = require("../models/NeedFlatmate");
const NeedRoom = require("../models/NeedRoom");
const User = require("../models/User");
const path = require("path"); // ✅ Import path module

let needRoomNotifications = []; // Store NeedRoom notifications for NeedFlatmate users

// 📌 1️⃣ Post "Need a Flatmate"
exports.postNeedFlatmate = async (req, res) => {
  try {
    // ✅ Check if user exists
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "❌ User not found" });
    }

    // ✅ Validate required fields
    const { location, lookingFor, rent, occupation, need, description } = req.body;
    if (!location || !lookingFor || !rent || !occupation || !need || !description) {
      return res.status(400).json({ message: "❌ All fields are required" });
    }

    // ✅ Handle Image Upload (Ensure Correct Path)
    let flatPic = "";
    if (req.file) {
      flatPic = path.join("uploads", req.file.filename).replace(/\\/g, "/"); // Normalize path
    }

    // ✅ Save NeedFlatmate Request
    const needFlatmate = new NeedFlatmate({
      userId: user._id,
      location,
      lookingFor,
      rent,
      occupation,
      description,
      need,
      flatPic,
    });

    await needFlatmate.save();

    // 🔔 Notify NeedRoom users about this post
    needRoomNotifications.push({
      message: `🆕 New Need Flatmate request by ${user.name} in ${location}.`,
      user: {
        name: user.name,
        gender: user.gender,
        city: user.city,
        profilePic: user.profilePic,
      },
      createdAt: new Date(),
    });

    res.status(201).json({
      message: "✅ Flatmate requirement posted successfully",
      needFlatmate,
    });

  } catch (error) {
    res.status(500).json({ message: "❌ Server error", error: error.message });
  }
};


// 📌 2️⃣ Get All "Need a Room" Posts (With Full User Details)
exports.getAllNeedRoomPosts = async (req, res) => {
  try {
    const needRooms = await NeedRoom.find()
      .populate("userId", "name mobile gender city profilePic")
      .sort({ createdAt: -1 });

    res.json(needRooms);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// 📌 3️⃣ Get Recent Notifications (With User Details)
exports.getNeedRoomNotifications = async (req, res) => {
  try {
    res.json({ message: "Recent NeedRoom notifications", notifications: needRoomNotifications });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
// 📌 4️⃣ Match "Need a Room" with "Need a Flatmate" (With Match Percentage)
exports.matchNeedRoom = async (req, res) => {
  try {
    const { location, lookingFor, rent, occupation } = req.body;

    let query = {};
    if (location) query.location = location;
    if (lookingFor) query.lookingFor = { $in: [lookingFor, "Any"] };
    if (rent) query.rent = rent;
    if (occupation) query.occupation = { $in: [occupation, "Any"] };

    const matches = await NeedRoom.find(query).populate("userId", "name mobile gender city profilePic");

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
