const Customer = require("./CustomerModel");

// Add Customer
exports.addCustomer = async (req, res) => {
  try {
    const existing = await Customer.findOne({ customerId: req.body.customerId });
    if (existing) return res.status(400).json({ error: "Customer already exists" });

    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).json(customer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Cannot add customer" });
  }
};

// Get customer by ID
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findOne({ customerId: req.params.id });
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    res.json(customer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get last customer ID
exports.getLastCustomerId = async (req, res) => {
  try {
    const last = await Customer.findOne().sort({ _id: -1 });
    const lastId = last ? parseInt(last.customerId.split("-")[1]) : 100;
    res.json({ lastId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Cannot fetch last customer ID" });
  }
};