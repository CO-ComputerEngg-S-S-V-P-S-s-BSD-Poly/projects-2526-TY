const express = require("express");
const router = express.Router();
const orderController = require("./OrderController");

router.get("/orders", orderController.getOrders);
router.put("/update/:id", orderController.updateStatus);

module.exports = router;