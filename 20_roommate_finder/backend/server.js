require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const preferenceRoutes = require("./routes/preferenceRoutes");
const needRoomRoutes = require("./routes/needRoomRoutes");
const needFlatmateRoutes = require("./routes/needFlatmateRoutes");

const app = express();

// ✅ Middleware
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const corsOptions = {
  origin: FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use("/uploads", express.static("uploads")); // ✅ Serve uploaded images from "uploads/"

// ✅ Connect to MongoDB
connectDB();

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/preferences", preferenceRoutes);
app.use("/api/need-room", needRoomRoutes);
app.use("/api/need-flatmate", needFlatmateRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
