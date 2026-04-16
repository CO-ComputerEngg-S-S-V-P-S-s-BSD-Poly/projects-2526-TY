const panditmodal = require("../models/Pandit");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
require("dotenv").config();


// ✅ EMAIL TRANSPORTER
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ EMAIL FUNCTION
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
const adduser = async (req, res) => {
  const { name, email, password, MobileNo, experience, address } = req.body;

  const specialization = JSON.parse(req.body.specialization);

  try {
    let user = await panditmodal.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new panditmodal({
      image: req.file ? req.file.filename : "",
      name,
      email,
      password: hashedPassword,
      MobileNo,
      experience,
      specialization,
      address,
      role: req.body.role   // ✅ role added
    });

    await user.save();

    // ✅ SEND WELCOME EMAIL
    await sendEmail(
      email,
      "Welcome to Pandit Website",
      `Hello ${name}, your account has been created successfully.`
    );

    res.json({ message: "User Registered Successfully", user });

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};


// ================= LOGIN =================
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await panditmodal.findOne({ email });
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

    // ✅ SEND LOGIN ALERT EMAIL
    await sendEmail(
      user.email,
      "Login Alert",
      `Hello ${user.name}, you have successfully logged in.`
    );

    res.json({
      token,
      message: "Login successful",
      user
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};


// ================= OTHER FUNCTIONS =================
const getuser = async (req, res) => {
  try {
    const data = await panditmodal.find();
    res.status(200).send({ data });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const deleteuser = async (req, res) => {
  try {
    const data = await panditmodal.deleteOne({ _id: req.params._id });
    if (data.deletedCount > 0) {
      res.status(200).send({ message: "User Deleted Successfully" });
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const updateuser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const data = await panditmodal.updateOne(
      { _id: req.params._id },
      { $set: { name, email, password } }
    );

    if (data.modifiedCount > 0) {
      res.status(200).send({ message: "User Updated Successfully" });
    } else {
      res.status(400).send({ message: "User Not Found" });
    }
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};


const getPanditBySpecialization = async (req, res) => {
  try {
    const { type } = req.params;

    const pandits = await panditmodal.find({
      role: "pandit",
      "specialization.name": type
    });
    res.status(200).json(pandits);

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error fetching pandits" });
  }
};


module.exports = { adduser, getuser, deleteuser, updateuser, login, getPanditBySpecialization };