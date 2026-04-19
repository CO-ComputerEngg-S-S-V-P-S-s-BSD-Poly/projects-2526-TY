// const express = require("express");
// const multer  = require("multer");
// const path    = require("path");

// const {
//   addProduct,
//   getAllProducts,
//   getProductsByShop,
//   getProductById,
//   updateProduct,
//   deleteProduct,
// } = require("../controllers/productController");

// const router = express.Router();

// // ── Multer — product images uploads/products/ mein save hongi ──
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/products/");
//   },
//   filename: (req, file, cb) => {
//     const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, unique + path.extname(file.originalname));
//   },
// });

// const upload = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
//   fileFilter: (req, file, cb) => {
//     const allowed = /jpeg|jpg|png|webp/;
//     const ext = allowed.test(path.extname(file.originalname).toLowerCase());
//     const mime = allowed.test(file.mimetype);
//     if (ext && mime) return cb(null, true);
//     cb(new Error("Sirf JPG, PNG, WEBP images allowed hain"));
//   },
// });

// // ── Routes ──

// // POST   /api/products          — Naya product add karo
// router.post("/",              upload.single("image"), addProduct);

// // GET    /api/products          — Sab products (frontend cards)
// router.get("/",               getAllProducts);

// // GET    /api/products/shop/:shopId — Shopkeeper ke apne products
// router.get("/shop/:shopId",   getProductsByShop);

// // GET    /api/products/:id      — Single product detail
// router.get("/:id",            getProductById);

// // PUT    /api/products/:id      — Product update
// router.put("/:id",            upload.single("image"), updateProduct);

// // DELETE /api/products/:id      — Product delete
// router.delete("/:id",         deleteProduct);

// module.exports = router;



//==================================================================



// const express = require("express");
// const multer  = require("multer");
// const path    = require("path");

// const {
//   addProduct,
//   getAllProducts,
//   getProductsByShop,
//   getProductById,
//   updateProduct,
//   deleteProduct,
// } = require("../controllers/productController");

// const Product = require("../models/Product");

// const router = express.Router();

// // ── Multer — product images uploads/products/ mein save hongi ──
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/products/");
//   },
//   filename: (req, file, cb) => {
//     const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, unique + path.extname(file.originalname));
//   },
// });

// const upload = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
//   fileFilter: (req, file, cb) => {
//     const allowed = /jpeg|jpg|png|webp/;
//     const ext = allowed.test(path.extname(file.originalname).toLowerCase());
//     const mime = allowed.test(file.mimetype);
//     if (ext && mime) return cb(null, true);
//     cb(new Error("Sirf JPG, PNG, WEBP images allowed hain"));
//   },
// });

// // ── Routes ──

// // POST   /api/products          — Naya product add karo
// router.post("/",              upload.single("image"), addProduct);

// // ✅ GET  /api/products/count   — Shopkeeper ke total products count (dashboard card)
// router.get("/count", async (req, res) => {
//   try {
//     const { shopName } = req.query;
//     if (!shopName) return res.json({ count: 0 });
//     const count = await Product.countDocuments({ shopName });
//     res.json({ count });
//   } catch (err) {
//     console.error("Count error:", err);
//     res.json({ count: 0 });
//   }
// });

// // GET    /api/products          — Sab products (frontend cards)
// router.get("/",               getAllProducts);

// // GET    /api/products/shop/:shopId — Shopkeeper ke apne products
// router.get("/shop/:shopId",   getProductsByShop);

// // GET    /api/products/:id      — Single product detail
// router.get("/:id",            getProductById);

// // PUT    /api/products/:id      — Product update
// router.put("/:id",            upload.single("image"), updateProduct);

// // DELETE /api/products/:id      — Product delete
// router.delete("/:id",         deleteProduct);


// // ✅ Compare List - product picker ke liye
// router.get("/compare-list", async (req, res) => {
//   try {
//     const { category } = req.query;
//     let matchQuery = { inStock: true };
//     if (category && category !== "All") {
//       matchQuery.category = { $regex: new RegExp(category, "i") };
//     }
//     const products = await Product.aggregate([
//       { $match: matchQuery },
//       {
//         $group: {
//           _id:       "$name",
//           name:      { $first: "$name" },
//           category:  { $first: "$category" },
//           basePrice: { $min: "$price" },
//           image:     { $first: "$image" },
//           shopCount: { $sum: 1 },
//         }
//       },
//       { $sort: { name: 1 } }
//     ]);
//     res.json({ products, total: products.length });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

// // ✅ Compare - ek product ke sabhi shops
// router.get("/compare", async (req, res) => {
//   try {
//     const { name } = req.query;
//     if (!name) return res.status(400).json({ message: "name param chahiye" });

//     const Shop = require("../models/Shop");
//     const products = await Product.find({ name: { $regex: new RegExp(name, "i") } })
//       .sort({ price: 1 });

//     if (!products.length) return res.json({ products: [], message: "Koi products nahi mile" });

//     const shopIds = [...new Set(products.map(p => p.shopId?.toString()).filter(Boolean))];
//     const shops   = await Shop.find({ _id: { $in: shopIds } });
//     const shopMap = {};
//     shops.forEach(s => { shopMap[s._id.toString()] = s; });

//     const enriched = products.map(p => {
//       const s = shopMap[p.shopId?.toString()] || {};
//       return {
//         _id:         p._id,
//         name:        p.name,
//         price:       p.price,
//         image:       p.image,
//         category:    p.category,
//         inStock:     p.inStock,
//         stockQty:    p.stockQty,
//         rating:      p.rating || 4.5,
//         reviews:     p.reviews || 0,
//         shopId:      p.shopId,
//         shopName:    p.shopName,
//         ownerName:   p.ownerName,
//         workingDays: s.workingDays || [],
//         openingTime: s.openingTime || "",
//         closingTime: s.closingTime || "",
//         profileImage:s.profileImage || "",
//         shopAddress: s.address || "",
//         shopPhone:   s.phone || "",
//       };
//     });

//     res.json({ products: enriched, total: enriched.length });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

// module.exports = router;






// #####################################################################

const express = require("express");
const multer  = require("multer");
const path    = require("path");

const {
  addProduct,
  getAllProducts,
  getProductsByShop,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const Product = require("../models/Product");

const router = express.Router();

// ── Multer — product images uploads/products/ mein save hongi ──
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/products/");
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) return cb(null, true);
    cb(new Error("Sirf JPG, PNG, WEBP images allowed hain"));
  },
});

// ════════════════════════════════════════════════════════
//  ROUTES — specific routes PEHLE, /:id wala SABSE LAST
// ════════════════════════════════════════════════════════

// POST /api/products — Naya product add karo
router.post("/", upload.single("image"), addProduct);

// GET /api/products/count — Shopkeeper ke total products count
router.get("/count", async (req, res) => {
  try {
    const { shopName } = req.query;
    if (!shopName) return res.json({ count: 0 });
    const count = await Product.countDocuments({ shopName });
    res.json({ count });
  } catch (err) {
    console.error("Count error:", err);
    res.json({ count: 0 });
  }
});

// GET /api/products/compare-list — Compare page product picker ke liye
router.get("/compare-list", async (req, res) => {
  try {
    const { category } = req.query;
    let matchQuery = {};
    if (category && category !== "All") {
      matchQuery.category = { $regex: new RegExp(category, "i") };
    }
    const products = await Product.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id:       "$name",
          name:      { $first: "$name" },
          category:  { $first: "$category" },
          basePrice: { $min: "$price" },
          image:     { $first: "$image" },
          shopCount: { $sum: 1 },
        }
      },
      { $sort: { name: 1 } }
    ]);
    res.json({ products, total: products.length });
  } catch (err) {
    console.error("Compare-list error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET /api/products/compare — Ek product ke sabhi shops ka data
router.get("/compare", async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) return res.status(400).json({ message: "name param chahiye" });

    const Shop = require("../models/Shop");
    const products = await Product.find({ name: { $regex: new RegExp(name, "i") } })
      .sort({ price: 1 });

    if (!products.length) return res.json({ products: [], message: "Koi products nahi mile" });

    const shopIds = [...new Set(products.map(p => p.shopId?.toString()).filter(Boolean))];
    const shops   = await Shop.find({ _id: { $in: shopIds } });
    const shopMap = {};
    shops.forEach(s => { shopMap[s._id.toString()] = s; });

    const enriched = products.map(p => {
      const s = shopMap[p.shopId?.toString()] || {};
      return {
        _id:          p._id,
        name:         p.name,
        price:        p.price,
        image:        p.image,
        category:     p.category,
        inStock:      p.inStock,
        stockQty:     p.stockQty,
        rating:       p.rating || 4.5,
        reviews:      p.reviews || 0,
        shopId:       p.shopId,
        shopName:     p.shopName,
        ownerName:    p.ownerName,
        workingDays:  s.workingDays || [],
        openingTime:  s.openingTime || "",
        closingTime:  s.closingTime || "",
        profileImage: s.profileImage || "",
        shopAddress:  s.address || "",
        shopPhone:    s.phone || "",
      };
    });

    res.json({ products: enriched, total: enriched.length });
  } catch (err) {
    console.error("Compare error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET /api/products — Sab products (frontend cards)
router.get("/", getAllProducts);

// GET /api/products/shop/:shopId — Shopkeeper ke apne products
router.get("/shop/:shopId", getProductsByShop);

// ⚠️ YEH HAMESHA SABSE LAST REHNA CHAHIYE
// GET /api/products/:id — Single product detail
router.get("/:id", getProductById);

// PUT /api/products/:id — Product update
router.put("/:id", upload.single("image"), updateProduct);

// DELETE /api/products/:id — Product delete
router.delete("/:id", deleteProduct);

module.exports = router;