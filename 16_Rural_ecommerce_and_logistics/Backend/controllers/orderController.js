const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");


// ================= 1️⃣ PLACE ORDER =================
// ================= 1️⃣ PLACE ORDER =================
exports.placeOrder = async (req, res) => {
  try {
    const { userId, items, paymentMethod } = req.body;

    // Check if user exists
    const userExists = await User.findById(userId);
    if (!userExists) return res.status(404).json({ msg: "User not found" });

    if (!userId || !items || items.length === 0) {
      return res.status(400).json({ msg: "Invalid order data" });
    }

    let totalAmount = 0;
    let totalAdminCommission = 0;
    let totalArtisanEarning = 0;
    const formattedItems = [];
    const commissionRate = 0.10; // 10% Commission

    for (let item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({ msg: `Product ${item.product} not found` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ msg: `Insufficient stock for ${product.name}` });
      }

      const itemTotal = product.price * item.quantity;
      const adminCommission = itemTotal * commissionRate;
      const artisanEarning = itemTotal - adminCommission;

      totalAmount += itemTotal;
      totalAdminCommission += adminCommission;
      totalArtisanEarning += artisanEarning;

      formattedItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
        itemTotal: itemTotal,
        artisan: product.artisan // Assumes product model has artisan (User ID)
      });

      // Reduce stock
      product.stock -= item.quantity;
      await product.save();

      // Update artisan earnings & order count
      await User.findByIdAndUpdate(product.artisan, {
        $inc: {
          earnings: artisanEarning,
          totalOrders: 1
        }
      });
    }

    const newOrder = new Order({
      user: userId, // Frontend se aane wali ID
      items: formattedItems,
      totalAmount,
      adminCommission: totalAdminCommission,
      artisanEarning: totalArtisanEarning,
      paymentMethod,
      paymentStatus: paymentMethod === "COD" ? "Pending" : "Completed",
      status: "Processing"
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder
    });

  } catch (error) {
    console.error("Place order error:", error);
    res.status(500).json({ success: false, msg: "Server error while placing order" });
  }
};


// ================= 2️⃣ GET USER ORDERS (Fixed for "No Orders" Issue) =================
exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId || userId === "undefined") {
      return res.status(400).json({ msg: "Valid User ID is required" });
    }

    // console.log("Searching orders for User ID:", userId); // Debugging log

    const orders = await Order.find({ user: userId })
      .populate("items.product", "name image price")
      .sort({ createdAt: -1 });

    // Hamesha response bhejein, chahe array khali ho
    res.status(200).json(orders);

  } catch (error) {
    console.error("User orders error:", error);
    res.status(500).json({ msg: "Orders fetch failed" });
  }
};



// ================= 3️⃣ GET ARTISAN ORDERS =================
exports.getArtisanOrders = async (req, res) => {

  try {

    const artisanId = req.params.artisanId;

    const orders = await Order.find({
      "items.artisan": artisanId
    })
      .populate("user", "firstName lastName email")
      .populate("items.product", "name price image")
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (error) {

    console.error("Artisan orders error:", error);

    res.status(500).json({
      msg: "Artisan orders fetch failed"
    });

  }

};



// Dono controllers ko ek generic function mein merge kiya ja sakta hai
exports.updateArtisanOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true } // Correct way to return updated doc
    )
    .populate("user", "firstName lastName email")
    .populate("items.product", "name price image");

    if (!order) return res.status(404).json({ msg: "Order not found" });

    res.json({ success: true, message: `Status updated to ${status}`, order });
  } catch (error) {
    res.status(500).json({ msg: "Status update failed" });
  }
};



// ================= 5️⃣ GET ALL ORDERS (ADMIN) =================
exports.getAllOrders = async (req, res) => {

  try {

    const orders = await Order.find()
      .populate("user", "firstName lastName email")
      .populate("items.product", "name price image")
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (error) {

    console.error("Admin orders error:", error);

    res.status(500).json({
      msg: "Admin orders fetch failed"
    });

  }

};



// ================= 6️⃣ UPDATE ORDER STATUS (ADMIN) =================
exports.updateOrderStatus = async (req, res) => {

  try {

    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { returnDocument: "after" }
    )
      .populate("user", "firstName lastName email")
      .populate("items.product", "name price image");

    if (!order) {
      return res.status(404).json({
        msg: "Order not found"
      });
    }

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      order
    });

  } catch (error) {

    console.error("Admin status update error:", error);

    res.status(500).json({
      msg: "Status update failed"
    });

  }

};



// ================= DEBUG =================
console.log("Controllers Loaded:");
console.log("placeOrder:", typeof exports.placeOrder);
console.log("getUserOrders:", typeof exports.getUserOrders);
console.log("getArtisanOrders:", typeof exports.getArtisanOrders);
console.log("updateArtisanOrderStatus:", typeof exports.updateArtisanOrderStatus);
console.log("updateOrderStatus:", typeof exports.updateOrderStatus);
console.log("getAllOrders:", typeof exports.getAllOrders);
