const express = require("express");
const router = express.Router();

const {
  submitQuote,
  getQuotesByShop,
  getQuoteById,
  respondToQuote,
  getQuotesByCustomer,
  deleteQuote,
} = require("../controllers/quoteController");

// ── Customer Routes ──────────────────────────
// Customer form submit karta hai
router.post("/", submitQuote);

// Customer apni email se status check karta hai
router.get("/customer/:email", getQuotesByCustomer);

// ── Shopkeeper Routes ────────────────────────
// Shopkeeper apne shop ke saare quotes dekhta hai
router.get("/shop/:shopId", getQuotesByShop);

// Single quote detail
router.get("/:id", getQuoteById);

// Shopkeeper approve/reject/quoted karta hai
router.put("/:id/respond", respondToQuote);

// Quote delete
router.delete("/:id", deleteQuote);

module.exports = router;