
const QuoteRequest = require("../models/QuoteRequest");
const nodemailer   = require("nodemailer");

// ── Email transporter ─────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendResponseEmail = async (quote) => {
  if (!quote.customerEmail) return;

  const statusText = {
    approved: "✅ Approved",
    rejected: "❌ Rejected",
    quoted:   "💰 Price Quoted",
  }[quote.status] || quote.status;

  try {
    await transporter.sendMail({
      from:    `"Songir Brass" <${process.env.EMAIL_USER}>`,
      to:      quote.customerEmail,
      subject: `Your Quote Request Update — ${statusText}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;background:#FFF8F0;border-radius:12px;overflow:hidden;border:1px solid #EED9BE;">
          <div style="background:linear-gradient(135deg,#B87333,#C9A44C);padding:20px 24px;">
            <h2 style="color:#fff;margin:0;font-size:20px;">🏺 Songir Brass</h2>
            <p style="color:rgba(255,255,255,0.85);margin:4px 0 0;font-size:13px;">Quote Request Update</p>
          </div>
          <div style="padding:24px;">
            <p style="color:#3E2723;font-size:15px;">Dear <strong>${quote.customerName}</strong>,</p>
            <p style="color:#6D4C41;font-size:14px;">Your quote request for <strong>${quote.productName}</strong> has been updated.</p>
            <div style="background:#fff;border:1px solid #EED9BE;border-radius:10px;padding:16px;margin:16px 0;">
              <p style="margin:0 0 8px;font-size:13px;color:#B87333;font-weight:700;text-transform:uppercase;">Status</p>
              <p style="margin:0;font-size:18px;font-weight:700;color:#3E2723;">${statusText}</p>
            </div>
            ${quote.shopkeeperNote ? `
            <div style="background:#E8F5E9;border-left:4px solid #4CAF50;border-radius:0 10px 10px 0;padding:12px 16px;margin:12px 0;">
              <p style="margin:0 0 4px;font-size:12px;color:#2E7D32;font-weight:700;">MESSAGE FROM SHOP</p>
              <p style="margin:0;font-size:14px;color:#1B5E20;">${quote.shopkeeperNote}</p>
            </div>` : ""}
            ${quote.quotedPrice ? `
            <div style="background:#E3F2FD;border-radius:10px;padding:14px 16px;margin:12px 0;text-align:center;">
              <p style="margin:0 0 4px;font-size:12px;color:#1565C0;font-weight:700;">QUOTED PRICE</p>
              <p style="margin:0;font-size:24px;font-weight:800;color:#0D47A1;">₹${quote.quotedPrice}</p>
            </div>` : ""}
            <p style="color:#9E8272;font-size:13px;margin-top:20px;">Thank you for choosing Songir Brass! 🙏</p>
          </div>
          <div style="background:#F5EDE0;padding:14px 24px;text-align:center;">
            <p style="margin:0;font-size:12px;color:#B87333;">© 2026 Songir Handcrafted Brass & Copper</p>
          </div>
        </div>
      `,
    });
    console.log("✅ Email sent to:", quote.customerEmail);
  } catch (err) {
    console.error("❌ Email send failed:", err.message);
  }
};

const submitQuote = async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, productName, description, quantity, budget, shopId } = req.body;
    if (!customerName || !customerEmail || !customerPhone || !productName || !shopId) {
      return res.status(400).json({ message: "Please fill all required fields." });
    }
    const newQuote = new QuoteRequest({ customerName, customerEmail, customerPhone, productName, description, quantity, budget, shopId: String(shopId) });
    await newQuote.save();
    res.status(201).json({ success: true, message: "Quote request submitted successfully!", quote: newQuote });
  } catch (error) {
    console.error("submitQuote error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getQuotesByShop = async (req, res) => {
  try {
    const { shopId } = req.params;
    const { status } = req.query;
    const filter = { shopId: String(shopId) };
    if (status) filter.status = status;
    const quotes = await QuoteRequest.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, total: quotes.length, quotes });
  } catch (error) {
    console.error("getQuotesByShop error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getQuoteById = async (req, res) => {
  try {
    const quote = await QuoteRequest.findById(req.params.id);
    if (!quote) return res.status(404).json({ message: "Quote request not found." });
    res.status(200).json({ success: true, quote });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const respondToQuote = async (req, res) => {
  try {
    const { status, shopkeeperNote, quotedPrice } = req.body;
    const allowedStatuses = ["approved", "rejected", "quoted"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${allowedStatuses.join(", ")}` });
    }
    const quote = await QuoteRequest.findById(req.params.id);
    if (!quote) return res.status(404).json({ message: "Quote request not found." });

    quote.status = status;
    if (shopkeeperNote) quote.shopkeeperNote = shopkeeperNote;
    if (quotedPrice)    quote.quotedPrice    = quotedPrice;
    quote.customerNotified = true;
    await quote.save();

    // ✅ Customer ko email bhejo
    await sendResponseEmail(quote);

    res.status(200).json({ success: true, message: `Quote ${status}. Customer notified via email.`, quote });
  } catch (error) {
    console.error("respondToQuote error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getQuotesByCustomer = async (req, res) => {
  try {
    const quotes = await QuoteRequest.find({ customerEmail: req.params.email.toLowerCase() }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, total: quotes.length, quotes });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteQuote = async (req, res) => {
  try {
    const quote = await QuoteRequest.findByIdAndDelete(req.params.id);
    if (!quote) return res.status(404).json({ message: "Quote not found." });
    res.status(200).json({ success: true, message: "Quote deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { submitQuote, getQuotesByShop, getQuoteById, respondToQuote, getQuotesByCustomer, deleteQuote };