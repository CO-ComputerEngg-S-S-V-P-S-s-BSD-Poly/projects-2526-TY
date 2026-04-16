const express = require("express");
const router = express.Router();
const Stock = require("./StockModel");
const datastockController = require("./StockController");

router.post("/add", async (req, res) => {
  try {
    const { date, company, type, qty, emptyUsed } = req.body;

    let stock = await Stock.findOne({ company, type });

    if (stock) {
      stock.qty = Number(stock.qty) + Number(qty);
      await stock.save();
    } else {
      stock = new Stock({
        date,
        company,
        type,
        qty,
        empty: 0
      });
      await stock.save();
    }

    let remaining = Number(qty);

    const allStocks = await Stock.find({ empty: { $gt: 0 } });

    for (let item of allStocks) {
      if (remaining <= 0) break;

      const available = Number(item.empty);

      if (available >= remaining) {
        item.empty = available - remaining;
        remaining = 0;
      } else {
        item.empty = 0;
        remaining -= available;
      }

      await item.save();
    }

    res.json({ message: "Stock added and empty reduced" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/all",datastockController.getStock);

router.put("/reduce",datastockController.reduceStock);

module.exports = router;