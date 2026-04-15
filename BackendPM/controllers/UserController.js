require("dotenv").config();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

// EMAIL TRANSPORTER
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// EMAIL FUNCTION
const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });
  } catch (error) {
    console.log("Email error:", error.message);
  }
};

// ================= REGISTER =================
const registerUser = async (req, res) => {
  const { name, email, password, MobileNo, address } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
      MobileNo,
      address,
      role: req.body.role 
    });

    await user.save();

    await sendEmail(
      email,
      "Welcome User 🎉",
      `Hello ${name}, your user account has been created successfully.`
    );

    res.json({ message: "User Registered Successfully", user });

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

// ================= LOGIN =================
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid email credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid password credentials" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    await sendEmail(
      user.email,
      "Login Alert",
      `Hello ${user.name}, you have successfully logged in.`
    );

    res.json({
      token,
      message: "Login successful",
      user,
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

module.exports = { registerUser, loginUser };