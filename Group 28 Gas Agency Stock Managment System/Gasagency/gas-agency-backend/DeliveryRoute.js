const express = require("express");
const router = express.Router();
const controller = require("./DeliveryController");

// STAFF
router.get("/staff", controller.getStaff);
router.post("/staff", controller.addStaff);

// ORDERS
router.get("/orders", controller.getOrders);
router.post("/orders", controller.addOrder);
router.delete("/orders/:id", controller.deleteOrder);
router.put("/orders/:id", controller.editOrder); 

// DELIVERY
router.get("/deliveries", controller.getDeliveries);
router.post("/assign", controller.assignDelivery);
router.post("/complete", controller.completeDelivery);
router.get("/history", controller.getHistory);

module.exports = router;