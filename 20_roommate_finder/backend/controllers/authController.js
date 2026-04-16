const User = require("../models/User");
const jwt = require("jsonwebtoken");

// 📌 Register User (Save New User & Generate Token)
exports.registerUser = async (req, res) => {
  try {
    const { mobile, name, gender, city } = req.body;
    const profilePic = req.file ? req.file.path.replace(/\\/g, "/") : ""; // ✅ Fix Windows Backslashes

    // ✅ Ensure all fields are provided
    if (!mobile || !name || !gender || !city) {
      return res.status(400).json({ message: "❌ All fields are required (Mobile, Name, Gender, City)." });
    }

    // ✅ Check if user already exists
    let user = await User.findOne({ mobile });

    if (user) {
      return res.status(400).json({ message: "❌ User already registered with this mobile number." });
    }

    // ✅ Create a new user entry
    user = new User({
      mobile,
      name,
      gender,
      city,
      profilePic,
    });

    await user.save(); // ✅ Save user

    // ✅ Generate JWT Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(201).json({ message: "✅ User registered successfully", user, token });
  } catch (error) {
    res.status(500).json({ message: "❌ Server error", error: error.message });
  }
};


// 📌 b) Login - Get OTP (No DB Insertion)
exports.getOtpForLogin = async (req, res) => {
  try {
    const { mobile } = req.body;

    let user = await User.findOne({ mobile });

    if (!user) {
      return res.status(400).json({ message: "❌ User not found. Please register first." });
    }

    const otp = "1234"; // ✅ Static OTP

    console.log(`🔹 OTP for ${mobile}: ${otp}`);

    res.json({ message: "✅ OTP sent successfully", otp });
  } catch (error) {
    res.status(500).json({ message: "❌ Server error", error: error.message });
  }
};

// 📌 c) Verify OTP & Login
exports.verifyLoginOtp = async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile) {
      return res.status(400).json({ message: "❌ Mobile number is required" });
    }

    let user = await User.findOne({ mobile });

    if (!user) {
      return res.status(400).json({ message: "❌ User not found. Please register first." });
    }

    if (otp !== "1234") {
      return res.status(400).json({ message: "❌ Invalid OTP" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ message: "✅ Login successful", token, user });
  } catch (error) {
    res.status(500).json({ message: "❌ Server error", error: error.message });
  }
};
