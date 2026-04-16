const express = require("express");
const router = express.Router();
const Bill = require("./billingModel");

// ✅ Add Bill
router.post("/", async (req, res) => {
  const newBill = new Bill(req.body);
  await newBill.save();
  res.json(newBill);
});

// ✅ Get Bills
router.get("/", async (req, res) => {
  const data = await Bill.find();
  res.json(data);
});

// ✅ Delete Bill
router.delete("/:id", async (req, res) => {
  await Bill.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted" });
});

router.get("/mobile/:mobile", async (req, res) => {
  try {

    const bill = await Bill.findOne({ mobile: req.params.mobile });

    if (!bill) {
      return res.status(404).json({ msg: "Not found" });
    }

    res.json(bill);

  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;