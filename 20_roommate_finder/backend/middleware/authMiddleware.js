const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 🔹 Check if token exists in headers
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized! No token provided." });
  }

  const token = authHeader.split(" ")[1]; // Extract token from Bearer

  try {
    // 🔹 Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔹 Attach user info to request (excluding password)
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(404).json({ message: "User not found!" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
