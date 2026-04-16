// const Product = require("../models/Product");
// const path    = require("path");
// const fs      = require("fs");

// // ══════════════════════════════════════════
// // POST /api/products  — Product add karo
// // ══════════════════════════════════════════
// const addProduct = async (req, res) => {
//   try {
//     const {
//       name, price, stockQty, description,
//       material, weight, category,
//       shopId, shopName, ownerName,
//     } = req.body;

//     // Validation
//     if (!name || !price || !category || !shopName) {
//       return res.status(400).json({
//         success: false,
//         message: "name, price, category aur shopName required hain.",
//       });
//     }

//     const imagePath = req.file
//       ? `uploads/products/${req.file.filename}`
//       : "";

//     const qty = Number(stockQty) || 0;

//     const product = await Product.create({
//       name:        name.trim(),
//       price:       Number(price),
//       stockQty:    qty,
//       description: description || "",
//       material:    material    || "",
//       weight:      weight      || "",
//       category,
//       shopId:      shopId      || null,
//       shopName,
//       ownerName:   ownerName   || "",
//       image:       imagePath,
//       inStock:     qty > 0,
//     });

//     res.status(201).json({ success: true, product });
//   } catch (err) {
//     console.error("addProduct error:", err);
//     res.status(500).json({ success: false, message: "Server error", error: err.message });
//   }
// };

// // ══════════════════════════════════════════
// // GET /api/products  — Sab products (frontend)
// // ══════════════════════════════════════════
// const getAllProducts = async (req, res) => {
//   try {
//     const { category, shopId, shopName } = req.query;
//     const filter = {};

//     if (category && category !== "All") filter.category = category;
//     if (shopId)   filter.shopId   = shopId;
//     if (shopName) filter.shopName = shopName;

//     const products = await Product.find(filter).sort({ createdAt: -1 });
//     res.json({ success: true, products });
//   } catch (err) {
//     console.error("getAllProducts error:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // ══════════════════════════════════════════
// // GET /api/products/shop/:shopId — Shopkeeper ke apne products
// // ══════════════════════════════════════════
// const getProductsByShop = async (req, res) => {
//   try {
//     const products = await Product
//       .find({ shopId: req.params.shopId })
//       .sort({ createdAt: -1 });

//     res.json({ success: true, products });
//   } catch (err) {
//     console.error("getProductsByShop error:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // ══════════════════════════════════════════
// // GET /api/products/:id — Single product
// // ══════════════════════════════════════════
// const getProductById = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) {
//       return res.status(404).json({ success: false, message: "Product nahi mila" });
//     }
//     res.json({ success: true, product });
//   } catch (err) {
//     console.error("getProductById error:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // ══════════════════════════════════════════
// // PUT /api/products/:id — Product update karo
// // ══════════════════════════════════════════
// const updateProduct = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) {
//       return res.status(404).json({ success: false, message: "Product nahi mila" });
//     }

//     const {
//       name, price, stockQty, description,
//       material, weight, category,
//     } = req.body;

//     // Agar naya image upload hua toh purana delete karo
//     if (req.file) {
//       if (product.image) {
//         const oldPath = path.join(__dirname, "..", product.image);
//         if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
//       }
//       product.image = `uploads/products/${req.file.filename}`;
//     }

//     if (name)        product.name        = name.trim();
//     if (price)       product.price       = Number(price);
//     if (stockQty !== undefined) {
//       product.stockQty = Number(stockQty);
//       product.inStock  = Number(stockQty) > 0;
//     }
//     if (description !== undefined) product.description = description;
//     if (material    !== undefined) product.material    = material;
//     if (weight      !== undefined) product.weight      = weight;
//     if (category)                  product.category    = category;

//     await product.save();
//     res.json({ success: true, product });
//   } catch (err) {
//     console.error("updateProduct error:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // ══════════════════════════════════════════
// // DELETE /api/products/:id — Product delete karo
// // ══════════════════════════════════════════
// const deleteProduct = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) {
//       return res.status(404).json({ success: false, message: "Product nahi mila" });
//     }

//     // Image file bhi delete karo
//     if (product.image) {
//       const imgPath = path.join(__dirname, "..", product.image);
//       if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
//     }

//     await Product.findByIdAndDelete(req.params.id);
//     res.json({ success: true, message: "Product successfully delete ho gaya" });
//   } catch (err) {
//     console.error("deleteProduct error:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// module.exports = {
//   addProduct,
//   getAllProducts,
//   getProductsByShop,
//   getProductById,
//   updateProduct,
//   deleteProduct,
// };


const Product = require("../models/Product");
const path    = require("path");
const fs      = require("fs");

const addProduct = async (req, res) => {
  try {
    const {
      name, price, stockQty, description,
      material, weight, category,
      shopId, shopName, ownerName,
    } = req.body;

    // ✅ shopName required nahi — sirf name, price, category check
    if (!name || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "name, price aur category required hain.",
      });
    }

    const imagePath = req.file
      ? `uploads/products/${req.file.filename}`
      : "";

    const qty = Number(stockQty) || 0;

    const product = await Product.create({
      name:        name.trim(),
      price:       Number(price),
      stockQty:    qty,
      description: description || "",
      material:    material    || "",
      weight:      weight      || "",
      category,
      shopId:      (shopId && shopId.match(/^[a-fA-F0-9]{24}$/)) ? shopId : null,
      shopName:    shopName    || "Unknown Shop",
      ownerName:   ownerName   || "",
      image:       imagePath,
      inStock:     qty > 0,
    });

    res.status(201).json({ success: true, product });
  } catch (err) {
    console.error("addProduct error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const { category, shopId, shopName } = req.query;
    const filter = {};

    if (category && category !== "All") filter.category = category;
    if (shopId)   filter.shopId   = shopId;
    if (shopName) filter.shopName = shopName;

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (err) {
    console.error("getAllProducts error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getProductsByShop = async (req, res) => {
  try {
    const products = await Product
      .find({ shopId: req.params.shopId })
      .sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (err) {
    console.error("getProductsByShop error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product nahi mila" });
    }
    res.json({ success: true, product });
  } catch (err) {
    console.error("getProductById error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product nahi mila" });
    }

    const { name, price, stockQty, description, material, weight, category } = req.body;

    if (req.file) {
      if (product.image) {
        const oldPath = path.join(__dirname, "..", product.image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      product.image = `uploads/products/${req.file.filename}`;
    }

    if (name)     product.name  = name.trim();
    if (price)    product.price = Number(price);
    if (stockQty !== undefined) {
      product.stockQty = Number(stockQty);
      product.inStock  = Number(stockQty) > 0;
    }
    if (description !== undefined) product.description = description;
    if (material    !== undefined) product.material    = material;
    if (weight      !== undefined) product.weight      = weight;
    if (category)                  product.category    = category;

    await product.save();
    res.json({ success: true, product });
  } catch (err) {
    console.error("updateProduct error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product nahi mila" });
    }

    if (product.image) {
      const imgPath = path.join(__dirname, "..", product.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Product successfully delete ho gaya" });
  } catch (err) {
    console.error("deleteProduct error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  addProduct,
  getAllProducts,
  getProductsByShop,
  getProductById,
  updateProduct,
  deleteProduct,
};