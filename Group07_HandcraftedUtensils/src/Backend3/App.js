
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const dotenv = require("dotenv");

// dotenv.config();

// const app = express();

// app.use(express.json());
// app.use(cors());

// // Routes
// const authRoutes = require("./routes/authRoutes");
// app.use("/api/auth", authRoutes);

// const shopRoutes = require("./routes/shopRoutes");
// app.use("/api/shops", shopRoutes);


// // MongoDB Connection
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB Connected"))
//   .catch((err) => console.log(err));

// app.listen(5000, () => {
//   console.log("Server running on port 5000");
// });

// mongoose.connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("MongoDB Connected");
//     console.log("Connected DB Name:", mongoose.connection.name);
//   })
//   .catch((err) => console.log(err));


//#########################################################################



// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const path = require("path");

// dotenv.config();

// const app = express();

// app.use(express.json());
// app.use(cors());

// // ✅ Uploaded images serve karo
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // ── Routes ──
// const authRoutes    = require("./routes/authRoutes");
// const shopRoutes    = require("./routes/shopRoutes");
// const productRoutes = require("./routes/productRoutes"); // ✅ ADD THIS

// app.use("/api/auth",     authRoutes);
// app.use("/api/shops",    shopRoutes);
// app.use("/api/products", productRoutes); // ✅ ADD THIS

// // ── MongoDB Connection ──
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("MongoDB Connected");
//     console.log("Connected DB Name:", mongoose.connection.name);
//     app.listen(5000, () => console.log("Server running on port 5000"));
//   })
//   .catch((err) => console.log(err));





/////////////////////////////////////////////////////////////


// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const path = require("path");

// dotenv.config();

// const app = express();

// app.use(express.json());
// app.use(cors());

// // ✅ Uploaded images serve karo
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // ── Routes ──
// const authRoutes    = require("./routes/authRoutes");
// const shopRoutes    = require("./routes/shopRoutes");
// const productRoutes = require("./routes/productRoutes");
// const quoteRoutes   = require("./routes/quoteRoutes"); // ✅ SIRF YE LINE ADD HUI

// app.use("/api/auth",     authRoutes);
// app.use("/api/shops",    shopRoutes);
// app.use("/api/products", productRoutes);
// app.use("/api/quotes",   quoteRoutes); // ✅ SIRF YE LINE ADD HUI

// // ── MongoDB Connection ──
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("MongoDB Connected");
//     console.log("Connected DB Name:", mongoose.connection.name);
//     app.listen(5000, () => console.log("Server running on port 5000"));
//   })
//   .catch((err) => console.log(err));


//==================================================

//==============================================



const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const recentlyViewedRoutes = require('./routes/recentlyViewed');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use('/', recentlyViewedRoutes);

// ✅ Uploaded images serve karo
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ── Routes ──
const authRoutes    = require("./routes/authRoutes");
const shopRoutes    = require("./routes/shopRoutes");
const productRoutes = require("./routes/productRoutes");
const quoteRoutes   = require("./routes/quoteRoutes");
const userRoutes    = require("./routes/customerRoute"); // ✅ customerRoute
const reviewRoutes = require("./routes/ReviewRoutes");

app.use("/api/auth",     authRoutes);
app.use("/api/shops",    shopRoutes);
app.use("/api/products", productRoutes);
app.use("/api/quotes",   quoteRoutes);
app.use("/api/users",    userRoutes);                  // ✅ NEW
app.use("/api/reviews", reviewRoutes);

// ── MongoDB Connection ──
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    console.log("Connected DB Name:", mongoose.connection.name);
    app.listen(5000, () => console.log("Server running on port 5000"));
  })
  .catch((err) => console.log(err));