// const Customer = require("../models/customerModel");

// // ── Register ──────────────────────────────────────────────────────────────────
// const registerUser = async (req, res) => {
//   try {
//     const { fullName, email, password, phone, address, city, state, pincode } = req.body;

//     if (!fullName || !email || !password) {
//       return res.status(400).json({ success: false, message: "Name, email and password are required!" });
//     }

//     const existing = await Customer.findOne({ email: email.toLowerCase() });
//     if (existing) {
//       return res.status(409).json({ success: false, message: "An account with this email already exists!" });
//     }

//     const newCustomer = await Customer.create({
//       fullName,
//       email,
//       password,
//       phone:   phone   || "",
//       address: address || "",
//       city:    city    || "",
//       state:   state   || "",
//       pincode: pincode || "",
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Account created successfully!",
//       user: {
//         id:       newCustomer._id,
//         fullName: newCustomer.fullName,
//         email:    newCustomer.email,
//       },
//     });
//   } catch (err) {
//     console.error("Register error:", err);
//     return res.status(500).json({ success: false, message: "Server error. Please try again." });
//   }
// };

// // ── Login ─────────────────────────────────────────────────────────────────────
// const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ success: false, message: "Email and password are required!" });
//     }

//     const customer = await Customer.findOne({ email: email.toLowerCase() });
//     if (!customer || customer.password !== password) {
//       return res.status(401).json({ success: false, message: "Invalid email or password!" });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Login successful!",
//       user: {
//         id:       customer._id,
//         fullName: customer.fullName,
//         email:    customer.email,
//         phone:    customer.phone,
//         address:  customer.address,
//         city:     customer.city,
//         state:    customer.state,
//         pincode:  customer.pincode,
//       },
//     });
//   } catch (err) {
//     console.error("Login error:", err);
//     return res.status(500).json({ success: false, message: "Server error. Please try again." });
//   }
// };

// // ── Get All Users (Admin Dashboard) ──────────────────────────────────────────
// const getAllUsers = async (req, res) => {
//   try {
//     const customers = await Customer.find({}).select("-password").sort({ createdAt: -1 });

//     const formatted = customers.map((c, idx) => ({
//       id:         `USR${String(idx + 1).padStart(3, "0")}`,
//       name:       c.fullName,
//       email:      c.email,
//       phone:      c.phone,
//       joinedDate: new Date(c.createdAt).toLocaleDateString("en-GB", {
//                     day: "2-digit", month: "short", year: "numeric"
//                   }),
//       status:     c.status,
//     }));

//     return res.status(200).json({ success: true, users: formatted });
//   } catch (err) {
//     console.error("Get users error:", err);
//     return res.status(500).json({ success: false, message: "Server error." });
//   }
// };

// module.exports = { registerUser, loginUser, getAllUsers };







const Customer = require("../models/customerModel");

// ── Register ──────────────────────────────────────────────────────────────────
const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, phone, address, city, state, pincode } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email and password are required!" });
    }

    const existing = await Customer.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: "An account with this email already exists!" });
    }

    const newCustomer = await Customer.create({
      fullName,
      email,
      password,
      phone:   phone   || "",
      address: address || "",
      city:    city    || "",
      state:   state   || "",
      pincode: pincode || "",
      status:  "Active", // ✅ register hote hi Active
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully!",
      user: {
        id:       newCustomer._id,
        fullName: newCustomer.fullName,
        email:    newCustomer.email,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};

// ── Login — status Active karo ────────────────────────────────────────────────
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required!" });
    }

    const customer = await Customer.findOne({ email: email.toLowerCase() });
    if (!customer || customer.password !== password) {
      return res.status(401).json({ success: false, message: "Invalid email or password!" });
    }

    // ✅ Login pe status Active karo
    await Customer.findByIdAndUpdate(customer._id, { status: "Active" });

    return res.status(200).json({
      success: true,
      message: "Login successful!",
      user: {
        id:       customer._id,
        fullName: customer.fullName,
        email:    customer.email,
        phone:    customer.phone,
        address:  customer.address,
        city:     customer.city,
        state:    customer.state,
        pincode:  customer.pincode,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};

// ── Logout — status Inactive karo ────────────────────────────────────────────
const logoutUser = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID required!" });
    }

    // ✅ Logout pe status Inactive karo
    await Customer.findByIdAndUpdate(userId, { status: "Inactive" });

    return res.status(200).json({ success: true, message: "Logged out successfully!" });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// ── Get All Users (Admin Dashboard) ──────────────────────────────────────────
const getAllUsers = async (req, res) => {
  try {
    const customers = await Customer.find({}).select("-password").sort({ createdAt: -1 });

    const formatted = customers.map((c, idx) => ({
      id:         `USR${String(idx + 1).padStart(3, "0")}`,
      name:       c.fullName,
      email:      c.email,
      phone:      c.phone,
      joinedDate: new Date(c.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit", month: "short", year: "numeric"
                  }),
      status:     c.status, // ✅ Real-time Active/Inactive
    }));

    return res.status(200).json({ success: true, users: formatted });
  } catch (err) {
    console.error("Get users error:", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

module.exports = { registerUser, loginUser, logoutUser, getAllUsers };





