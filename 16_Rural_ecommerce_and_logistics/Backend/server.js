const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Routes
const orderRoutes = require('./routes/orderRoutes');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

const app = express();


// ================= 1️⃣ MIDDLEWARES =================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// ================= 2️⃣ DATABASE CONNECTION =================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ GramKala MongoDB Connected Successfully!"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  });


// ================= 3️⃣ API ROUTES =================

// Health Check
app.get('/', (req, res) => {
  res.send("GramKala Backend Server is Running... 🚀");
});

// Auth
app.use('/api/auth', authRoutes);

// Products
app.use('/api/products', productRoutes);

// Orders
app.use('/api/orders', orderRoutes);


// ================= 4️⃣ GLOBAL ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);
  res.status(500).json({
    message: "Server mein kuch gadbad hai!",
    error: err.message
  });
});


// ================= 5️⃣ START SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
*****************************************
🚀 Server is up and running on Port: ${PORT}
📡 API URL: http://localhost:${PORT}/api
*****************************************
`);
});
