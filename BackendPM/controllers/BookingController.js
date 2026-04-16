const Booking = require("../models/Booking");
const User = require("../models/User");
const Pandit = require("../models/Pandit");
const nodemailer = require("nodemailer");

const createBooking = async (req, res) => {
  try {
    const { userId, panditId, pujaSlug, date, price, time, name, address, phone   } = req.body;

    if (!userId || !panditId || !pujaSlug) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const user = await User.findById(userId);
    const pandit = await Pandit.findById(panditId);

    if (!user || !pandit) {
      return res.status(404).json({ message: "User or Pandit not found" });
    }

    const booking = await Booking.create({
  user: userId,
  pandit: panditId,
  pujaSlug,
  date,
  time,
  price,
  status: "Pending",

  // 🔥 ADD THIS
  name: name || user.name,
  address: address || user.address,
  phone: phone || user.phone
});

    // EMAIL SETUP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // EMAIL TO PANDIT
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: pandit.email,
      subject: "New Puja Booking Request",
      text: `
You have a new booking request.

User Email: ${user.email}
Puja: ${pujaSlug}
Status: Pending
      `
    });

    res.status(201).json({ message: "Booking request sent to Pandit" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Booking failed" });
  }
};

const getPanditBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ pandit: req.params.id })
      .populate("user");

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings" });
  }
};

const confirmBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "Confirmed" },
      { new: true }
    ).populate("user");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // EMAIL TO USER
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: booking.user.email,
      subject: "Booking Confirmed",
      text: `Your booking for ${booking.pujaSlug} has been confirmed by Pandit.`
    });

    res.json({ message: "Booking Confirmed" });

  } catch (error) {
    res.status(500).json({ message: "Error confirming booking" });
  }
};

const getUserBookings = async (req, res) => {
  try {
    console.log("User ID:", req.params.id);

    const bookings = await Booking.find({
      user: req.params.id
    })
      .populate("pandit")
      .sort({ date: -1 });

    console.log("Bookings Found:", bookings);

    res.status(200).json(bookings);
  } catch (error) {
    console.log("FULL ERROR:", error);
    res.status(500).json({ message: "Error fetching user bookings" });
  }
};

const rejectBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "Rejected" },
      { new: true }
    ).populate("user");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // EMAIL TO USER
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: booking.user.email,
      subject: "Booking Rejected",
      text: `Your booking for ${booking.pujaSlug} has been rejected by Pandit.`
    });

    res.json({ message: "Booking Rejected" });

  } catch (error) {
    res.status(500).json({ message: "Error rejecting booking" });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting booking" });
  }
};

module.exports = { createBooking, getPanditBookings, confirmBooking, getUserBookings, rejectBooking, deleteBooking };