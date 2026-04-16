

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const orderRoutes = require("./OrderRoute");

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/gasAgency")
  .then(() => console.log("MongoDB Connected (●'◡'●)"))
  .catch(err => console.log("MongoDB Connection Error:", err));

// Routes
app.use("/api/auth", require("./LoginRoute"));       // Login
app.use("/api/delivery", require("./DeliveryRoute")); // Delivery routes
// app.use("/api/datastock",datastockRoutes)
app.use("/api/sstock", require("./StockRoute")); 
// Routes
app.use("/api/delivery", orderRoutes);
// app.use("/api/orders", orderRoutes);

// Routes
const customerRoutes = require("./customerRoutes");
const billingRoutes = require("./billingRoutes");

// Routes
app.use("/api/customers", customerRoutes);
app.use("/api/bills", billingRoutes);



// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));