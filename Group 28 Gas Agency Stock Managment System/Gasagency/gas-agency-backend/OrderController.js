const Delivery = require("./DeliveryModel");
const Order = require("./OrderModel");

// GET ALL DELIVERIES
exports.getOrders = async (req, res) => {
  try {
    const deliveries = await Delivery.find();
    res.json(deliveries);
  } catch (err) {
    res.status(500).json(err);
  }
};

// COMPLETE DELIVERY + STOCK UPDATE
exports.updateStatus = async (req, res) => {
  try {
    const id = req.params.id;

    // DELIVERY STATUS UPDATE
    const delivery = await Delivery.findOneAndUpdate(
      { orderId: id },
      { status: "Delivered", date: new Date().toLocaleString() },
      { new: true }
    );
    if (!delivery) return res.status(404).json({ message: "Delivery not found" });

    // STOCK REDUCE + EMPTY CYLINDER INCREMENT
    const order = await Order.findOne({ orderId: id });
    if (order) {
      if (order.cylinders > 0) order.cylinders -= 1;
      order.emptyCylinders += 1;
      await order.save();
    }

    res.json(delivery);

  } catch (err) {
    res.status(500).json(err);
  }
};