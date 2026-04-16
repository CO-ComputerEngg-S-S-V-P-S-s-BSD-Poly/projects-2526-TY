const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1️⃣ REGISTER
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, village, craftType } = req.body;

    if (!firstName || !email || !password) {
      return res.status(400).json({ msg: "Please fill all required fields!" });
    }

    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "Email already registered!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: role || 'customer',
      village,
      craftType: role === 'artisan' ? craftType : '',
      isApproved: role === 'artisan' ? false : true
    });

    await newUser.save();

    res.status(201).json({
      msg: role === 'artisan'
        ? "Registration successful! Wait for admin approval."
        : "Registration successful! You can login now."
    });

  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};


// 2️⃣ LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Email not found!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Incorrect password!" });

    // ❗ Important: Artisan must be approved
    if (user.role === 'artisan' && !user.isApproved) {
      return res.status(403).json({ msg: "Your account is pending admin approval." });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role
      }
    });

  } catch (err) {
    res.status(500).json({ msg: "Login error occurred" });
  }
};


// 3️⃣ GET PENDING ARTISANS
exports.getPendingSellers = async (req, res) => {
  try {
    const sellers = await User.find({
      role: 'artisan',
      isApproved: false
    }).select('-password');

    res.json(sellers);
  } catch (err) {
    res.status(500).json({ msg: "Unable to fetch pending sellers" });
  }
};


// 4️⃣ APPROVE SELLER
exports.approveSeller = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ msg: "Artisan not found" });
    }

    res.json({ msg: "Seller approved successfully!", user: updatedUser });

  } catch (err) {
    res.status(500).json({ msg: "Approval failed" });
  }
};


// 5️⃣ ADMIN STATS
exports.getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalArtisans = await User.countDocuments({ role: 'artisan', isApproved: true });
    const pendingApprovals = await User.countDocuments({ role: 'artisan', isApproved: false });

    res.json({
      totalUsers,
      totalArtisans,
      pendingApprovals
    });

  } catch (err) {
    res.status(500).json({ msg: "Stats error" });
  }
};
