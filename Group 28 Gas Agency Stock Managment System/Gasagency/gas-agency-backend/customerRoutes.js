const express = require("express");
const router = express.Router();
const Customer = require("./CustomerModel");

// ✅ Add Customer
router.post("/", async (req, res) => {
  const newCustomer = new Customer(req.body);
  await newCustomer.save();
  res.json(newCustomer);
});

// ✅ Get Customers
router.get("/", async (req, res) => {
  const data = await Customer.find();
  res.json(data);
});

module.exports = router;