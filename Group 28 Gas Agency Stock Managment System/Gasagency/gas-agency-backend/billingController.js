const Bill = require("./billingModel");

// Get all bills
exports.getAllBills = async (req, res) => {
  try {
    const bills = await Bill.find();
    res.json(bills);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Cannot fetch bills" });
  }
};

// Get last bill number
exports.getLastBillId = async (req, res) => {
  try {
    const lastBill = await Bill.findOne().sort({ _id: -1 });
    const lastBillId = lastBill ? parseInt(lastBill.billNo.split("-")[1]) : 1000;
    res.json({ lastBillId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Cannot fetch last bill ID" });
  }
};

// Add new bill
exports.addBill = async (req, res) => {
  try {
    const bill = new Bill(req.body);
    await bill.save();
    res.status(201).json(bill);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Cannot add bill" });
  }
};

// Delete bill
exports.deleteBill = async (req, res) => {
  try {
    await Bill.findByIdAndDelete(req.params.id);
    res.json({ message: "Bill deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Cannot delete bill" });
  }
};