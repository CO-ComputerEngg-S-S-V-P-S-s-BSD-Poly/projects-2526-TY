// const Shop = require("../models/Shop");

// // ========== CREATE SHOP ==========
// exports.createShop = async (req, res) => {
//   try {
//     const shopData = {
//       ...req.body,
//       profileImage: req.file ? req.file.path : null,
//       status: "pending" // Always pending by default
//     };

//     const shop = new Shop(shopData);
//     await shop.save();
    
//     res.status(201).json({ 
//       message: "Shop submitted for admin approval!",
//       shop 
//     });
//   } catch (err) {
//     console.error("Error creating shop:", err);
//     res.status(500).json({ 
//       message: "Failed to create shop",
//       error: err.message 
//     });
//   }
// };

// // ========== GET ALL SHOPS ==========
// exports.getAllShops = async (req, res) => {
//   try {
//     const shops = await Shop.find().sort({ createdAt: -1 });
//     res.status(200).json(shops);
//   } catch (err) {
//     console.error("Error fetching shops:", err);
//     res.status(500).json({ 
//       message: "Failed to fetch shops",
//       error: err.message 
//     });
//   }
// };

// // ========== GET PENDING SHOPS ==========
// exports.getPendingShops = async (req, res) => {
//   try {
//     const shops = await Shop.find({ status: "pending" }).sort({ createdAt: -1 });
//     res.json(shops);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // ========== GET APPROVED SHOPS ==========
// exports.getApprovedShops = async (req, res) => {
//   try {
//     const shops = await Shop.find({ status: "approved" }).sort({ createdAt: -1 });
//     res.json(shops);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // ========== APPROVE SHOP ==========
// exports.approveShop = async (req, res) => {
//   try {
//     const shop = await Shop.findByIdAndUpdate(
//       req.params.id,
//       { status: "approved" },
//       { new: true }
//     );

//     if (!shop) {
//       return res.status(404).json({ message: "Shop not found" });
//     }

//     res.json({ 
//       message: "Shop Approved ✅",
//       shop 
//     });
//   } catch (err) {
//     console.error("Error approving shop:", err);
//     res.status(500).json({ 
//       message: "Failed to approve shop",
//       error: err.message 
//     });
//   }
// };

// // ========== REJECT SHOP ==========
// exports.rejectShop = async (req, res) => {
//   try {
//     const { reason } = req.body;

//     if (!reason) {
//       return res.status(400).json({ message: "Rejection reason is required" });
//     }

//     const shop = await Shop.findByIdAndUpdate(
//       req.params.id,
//       { 
//         status: "rejected",
//         rejectionReason: reason 
//       },
//       { new: true }
//     );

//     if (!shop) {
//       return res.status(404).json({ message: "Shop not found" });
//     }

//     res.json({ 
//       message: "Shop Rejected ❌",
//       shop 
//     });
//   } catch (err) {
//     console.error("Error rejecting shop:", err);
//     res.status(500).json({ 
//       message: "Failed to reject shop",
//       error: err.message 
//     });
//   }
// };

// // ========== DELETE SHOP ==========
// exports.deleteShop = async (req, res) => {
//   try {
//     const shop = await Shop.findByIdAndDelete(req.params.id);

//     if (!shop) {
//       return res.status(404).json({ message: "Shop not found" });
//     }

//     res.json({ message: "Shop deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ 
//       message: "Failed to delete shop",
//       error: err.message 
//     });
//   }
// };


// #################################################################

const Shop = require("../models/Shop");
const Product = require("../models/Product"); // ✅ Product model import

// ========== CREATE SHOP ==========
exports.createShop = async (req, res) => {
  try {
    const shopData = {
      ...req.body,
      profileImage: req.file ? req.file.path : null,
      status: "pending" // Always pending by default
    };

    const shop = new Shop(shopData);
    await shop.save();
    
    res.status(201).json({ 
      message: "Shop submitted for admin approval!",
      shop 
    });
  } catch (err) {
    console.error("Error creating shop:", err);
    res.status(500).json({ 
      message: "Failed to create shop",
      error: err.message 
    });
  }
};

// ========== GET ALL SHOPS ==========
exports.getAllShops = async (req, res) => {
  try {
    const shops = await Shop.find().sort({ createdAt: -1 });
    res.status(200).json(shops);
  } catch (err) {
    console.error("Error fetching shops:", err);
    res.status(500).json({ 
      message: "Failed to fetch shops",
      error: err.message 
    });
  }
};

// ========== GET PENDING SHOPS ==========
exports.getPendingShops = async (req, res) => {
  try {
    const shops = await Shop.find({ status: "pending" }).sort({ createdAt: -1 });
    res.json(shops);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ========== GET APPROVED SHOPS (FIXED - products bhi aayenge ab) ==========
exports.getApprovedShops = async (req, res) => {
  try {
    const shops = await Shop.find({ status: "approved" }).sort({ createdAt: -1 });

    // ✅ Har shop ke saath uske products bhi fetch karo
    const shopsWithProducts = await Promise.all(
      shops.map(async (shop) => {
        const products = await Product.find({ shopName: shop.shopName }).sort({ createdAt: -1 });
        return {
          ...shop.toObject(),
          products: products // ✅ Products array attach
        };
      })
    );

    res.json(shopsWithProducts);
  } catch (err) {
    console.error("Error fetching approved shops:", err);
    res.status(500).json({ error: err.message });
  }
};

// ========== APPROVE SHOP ==========
exports.approveShop = async (req, res) => {
  try {
    const shop = await Shop.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    res.json({ 
      message: "Shop Approved ✅",
      shop 
    });
  } catch (err) {
    console.error("Error approving shop:", err);
    res.status(500).json({ 
      message: "Failed to approve shop",
      error: err.message 
    });
  }
};

// ========== REJECT SHOP ==========
exports.rejectShop = async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ message: "Rejection reason is required" });
    }

    const shop = await Shop.findByIdAndUpdate(
      req.params.id,
      { 
        status: "rejected",
        rejectionReason: reason 
      },
      { new: true }
    );

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    res.json({ 
      message: "Shop Rejected ❌",
      shop 
    });
  } catch (err) {
    console.error("Error rejecting shop:", err);
    res.status(500).json({ 
      message: "Failed to reject shop",
      error: err.message 
    });
  }
};

// ========== DELETE SHOP ==========
exports.deleteShop = async (req, res) => {
  try {
    const shop = await Shop.findByIdAndDelete(req.params.id);

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    res.json({ message: "Shop deleted successfully" });
  } catch (err) {
    res.status(500).json({ 
      message: "Failed to delete shop",
      error: err.message 
    });
  }
};