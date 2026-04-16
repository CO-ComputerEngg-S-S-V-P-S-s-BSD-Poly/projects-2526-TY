// // const express = require("express");
// // const router = express.Router();
// // const shopController = require("../controllers/ShopController");
// // const upload = require("../middleware/upload");

// // // ========== POST - Create Shop (Form Submit) ==========
// // router.post("/", upload.single("profileImage"), shopController.createShop);

// // // ========== GET - All Shops (Admin Dashboard) ==========
// // router.get("/", shopController.getAllShops);

// // // ========== GET - Pending Shops Only ==========
// // router.get("/pending", shopController.getPendingShops);

// // // ========== GET - Approved Shops Only (Frontend Cards) ==========
// // router.get("/approved", shopController.getApprovedShops);

// // // ========== PUT - Approve Shop ==========
// // router.put("/approve/:id", shopController.approveShop);

// // // ========== PUT - Reject Shop ==========
// // router.put("/reject/:id", shopController.rejectShop);

// // // ========== DELETE - Delete Shop (Optional) ==========
// // router.delete("/:id", shopController.deleteShop);

// // module.exports = router;




// const express = require("express");
// const router = express.Router();
// const shopController = require("../controllers/ShopController");
// const upload = require("../middleware/upload");
// const Product = require("../models/Product"); // ✅ apna Product model path check karo

// // ========== POST - Create Shop (Form Submit) ==========
// router.post("/", upload.single("profileImage"), shopController.createShop);

// // ========== GET - All Shops (Admin Dashboard) ==========
// router.get("/", shopController.getAllShops);

// // ========== GET - Pending Shops Only ==========
// router.get("/pending", shopController.getPendingShops);

// // ========== GET - Approved Shops Only (Frontend Cards) ==========
// router.get("/approved", shopController.getApprovedShops);

// // ========== PUT - Approve Shop ==========
// router.put("/approve/:id", shopController.approveShop);

// // ========== PUT - Reject Shop ==========
// router.put("/reject/:id", shopController.rejectShop);

// // ========== DELETE - Delete Shop ==========
// router.delete("/:id", shopController.deleteShop);

// // ========== ✅ GET - Shopkeeper Stats (Dashboard Cards) ==========
// router.get("/stats", async (req, res) => {
//   try {
//     const { shopName } = req.query;

//     if (!shopName) {
//       return res.json({ totalProducts: 0, enquiries: 0, rating: 0 });
//     }

//     const totalProducts = await Product.countDocuments({ shopName });

//     res.json({ totalProducts, enquiries: 0, rating: 0 });
//   } catch (err) {
//     console.error("Stats error:", err);
//     res.status(500).json({ totalProducts: 0, enquiries: 0, rating: 0 });
//   }
// });

// // ========== ✅ GET - Shopkeeper Recent Products (Dashboard) ==========
// router.get("/products", async (req, res) => {
//   try {
//     const { shopName, limit = 4 } = req.query;

//     if (!shopName) return res.json({ products: [] });

//     const products = await Product.find({ shopName })
//       .sort({ createdAt: -1 })
//       .limit(Number(limit));

//     res.json({ products });
//   } catch (err) {
//     console.error("Products fetch error:", err);
//     res.status(500).json({ products: [] });
//   }
// });

// module.exports = router;



//==============================================================



const express = require("express");
const router = express.Router();
const shopController = require("../controllers/ShopController");
const upload = require("../middleware/upload");
const Product = require("../models/Product");

// ========== POST - Create Shop (Form Submit) ==========
router.post("/", upload.single("profileImage"), shopController.createShop);

// ========== GET - All Shops (Admin Dashboard) ==========
router.get("/", shopController.getAllShops);

// ========== GET - Pending Shops Only ==========
router.get("/pending", shopController.getPendingShops);

// ========== GET - Approved Shops Only (Frontend Cards) ==========
router.get("/approved", shopController.getApprovedShops);

// ========== PUT - Approve Shop ==========
router.put("/approve/:id", shopController.approveShop);

// ========== PUT - Reject Shop ==========
router.put("/reject/:id", shopController.rejectShop);

// ========== DELETE - Delete Shop ==========
router.delete("/:id", shopController.deleteShop);

// ========== GET - Shopkeeper Stats (Dashboard Cards) ==========
router.get("/stats", async (req, res) => {
  try {
    const { shopName } = req.query;
    if (!shopName) return res.json({ totalProducts: 0, totalViews: 0, enquiries: 0, rating: 0 });
    const totalProducts = await Product.countDocuments({ shopName });
    res.json({ totalProducts, totalViews: 0, enquiries: 0, rating: 0 });
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ totalProducts: 0, totalViews: 0, enquiries: 0, rating: 0 });
  }
});

// ========== GET - Shopkeeper Recent Products (Dashboard) ==========
router.get("/products", async (req, res) => {
  try {
    const { shopName, limit = 4 } = req.query;
    if (!shopName) return res.json({ products: [] });
    const products = await Product.find({ shopName })
      .sort({ createdAt: -1 })
      .limit(Number(limit));
    res.json({ products });
  } catch (err) {
    console.error("Products fetch error:", err);
    res.status(500).json({ products: [] });
  }
});


// / ✅ Compare ke liye approved shops
router.get("/compare-shops", async (req, res) => {
  try {
    const Shop = require("../models/Shop");
    const shops = await Shop.find({ status: "approved" })
      .select("shopName ownerName workingDays openingTime closingTime profileImage address phone")
      .sort({ shopName: 1 });
    res.json({ shops, total: shops.length });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


module.exports = router;