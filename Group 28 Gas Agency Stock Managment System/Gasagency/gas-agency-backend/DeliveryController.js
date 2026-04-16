const mongoose = require("mongoose");
const { Staff, Order, Delivery } = require("./DeliveryModel");
const Stock = require("./StockModel");

// ---------------- STAFF ----------------
exports.getStaff = async (req, res) => {
  try {
    const staff = await Staff.find();
    res.json(staff);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching staff" });
  }
};

exports.addStaff = async (req, res) => {
  try {
    const newStaff = await Staff.create(req.body);
    res.json(newStaff);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding staff" });
  }
};

// ---------------- ORDERS ----------------
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching orders" });
  }
};

exports.addOrder = async (req, res) => {
  try {
    const count = await Order.countDocuments();
    const generatedId = String(count + 1).padStart(6, "0");

    const order = await Order.create({
      orderId: generatedId,
      customer: req.body.customer,
      area: req.body.area,
      cylinders: req.body.cylinders,
      type: req.body.type,
      status: "Pending"
    });

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating order" });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting order" });
  }
};

// ---------------- EDIT ORDER ----------------
exports.editOrder = async (req, res) => {
  try {
    const { customer, area, cylinders } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Update order fields
    order.customer = customer || order.customer;
    order.area = area || order.area;
    order.cylinders = cylinders || order.cylinders;
    await order.save();

    // Also update completed delivery history
    await Delivery.updateMany(
      { orderId: order.orderId, status: "Completed" },
      { customer: order.customer, area: order.area, cylinders: order.cylinders }
    );

    res.json(order);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error editing order" });
  }
};

// ---------------- ASSIGN DELIVERY ----------------
exports.assignDelivery = async (req, res) => {
  try {
    const { orderId, staffId } = req.body;

    const order = await Order.findById(orderId);
    const staff = await Staff.findById(staffId);

    if (!order || !staff) {
      return res.status(404).json({ message: "Order or Staff not found" });
    }

    const delivery = await Delivery.create({
      orderId: order.orderId,
      staff: staff.name,
      customer: order.customer,
      area: order.area,
      cylinders: order.cylinders,
     type: order.type || "Domestic",
      status: "On Delivery",
      date: new Date().toLocaleString()
    });

    order.status = "Assigned";
    await order.save();

    res.json(delivery);

  } catch (error) {
    console.error("Assign Delivery Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- ACTIVE DELIVERIES ----------------
exports.getDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find({ status: "On Delivery" });
    res.json(deliveries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching deliveries" });
  }
};

// ---------------- COMPLETE DELIVERY ----------------
exports.completeDelivery = async (req, res) => {
  try {
    const { deliveryId } = req.body;

    const delivery = await Delivery.findById(deliveryId);
    console.log("DELIVERY TYPE =>", delivery.type);
console.log("CYLINDERS =>", delivery.cylinders);
    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    delivery.status = "Completed";
    delivery.date = new Date().toLocaleString();
    await delivery.save();

   const stock = await Stock.findOne({
  type: delivery.type
}).sort({ _id: -1 });

console.log("STOCK FOUND =>", stock);

if (stock) {
  stock.qty = Math.max(
    0,
    Number(stock.qty) - Number(delivery.cylinders)
  );

  stock.empty =
    Number(stock.empty || 0) + Number(delivery.cylinders);

  await stock.save();
}

    res.json(delivery);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error completing delivery" });
  }
};

// ---------------- DELIVERY HISTORY ----------------
exports.getHistory = async (req, res) => {
  try {
    const history = await Delivery.find({ status: "Completed" });

    const formattedHistory = history.map((h) => ({
      orderId: h.orderId,
      staff: h.staff,
      customer: h.customer,
      area: h.area,
      cylinders: h.cylinders,
      date: h.date
    }));

    res.json(formattedHistory);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching history" });
  }
};