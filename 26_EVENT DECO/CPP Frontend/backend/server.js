const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, "data", "decorations.json");
const IMAGE_UPLOAD_DIR = path.join(__dirname, "..", "assest", "uploads", "decorations");

fs.mkdirSync(IMAGE_UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, IMAGE_UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase() || ".jpg";
    const safeBase = path
      .basename(file.originalname || "decoration-image", ext)
      .replace(/[^a-zA-Z0-9_-]/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 50) || "decoration-image";
    cb(null, `${Date.now()}-${safeBase}${ext}`);
  }
});

const upload = multer({ storage });

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use("/assest", express.static(path.join(__dirname, "..", "assest")));

function readDecorations() {
  const raw = fs.readFileSync(DATA_FILE, "utf8");
  return JSON.parse(raw);
}

function writeDecorations(items) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2));
}

function normalizeText(value) {
  return String(value || "").trim().toLowerCase();
}

function toBudgetBand(priceValue) {
  const n = Number(priceValue);
  if (!Number.isFinite(n)) return "medium";
  if (n < 15000) return "low";
  if (n <= 30000) return "medium";
  return "high";
}

function toPosixImagePath(filename) {
  return `assest/uploads/decorations/${filename}`.replace(/\\/g, "/");
}

function buildDecorationPayload(body, uploadedFileName) {
  const category = normalizeText(body.category || body.event || body.event_type || "festival");
  const budget = normalizeText(body.budget || body.budget_category || "") || toBudgetBand(body.price);
  const imagePath = uploadedFileName
    ? toPosixImagePath(uploadedFileName)
    : (body.image || "assest/images/main img.webp");

  return {
    id: body.id || `theme-${Date.now()}`,
    title: body.title,
    description: body.description,
    price: Number(body.price),
    category,
    budget,
    event_type: body.event_type || body.event || category,
    budget_category: body.budget_category || body.budget || budget,
    inclusions: body.inclusions || "",
    idealFor: body.idealFor || "",
    image: imagePath
  };
}

function createDecorationHandler(req, res) {
  const body = req.body || {};
  const required = ["title", "price", "description"];
  const missing = required.filter((field) => !body[field]);

  if (missing.length > 0) {
    return res.status(400).json({
      message: "Missing required fields",
      missing
    });
  }

  const items = readDecorations();
  const newItem = buildDecorationPayload(body, req.file && req.file.filename);

  items.push(newItem);
  writeDecorations(items);

  res.status(201).json(newItem);
}

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "gallery-api" });
});

app.get("/api/decorations", (req, res) => {
  const category = normalizeText(req.query.category);
  const budget = normalizeText(req.query.budget);

  let items = readDecorations();

  if (category && category !== "all") {
    items = items.filter((item) => normalizeText(item.category) === category);
  }

  if (budget && budget !== "all") {
    items = items.filter((item) => normalizeText(item.budget) === budget);
  }

  res.json(items);
});

app.get("/api/decorations/:id", (req, res) => {
  const id = String(req.params.id);
  const items = readDecorations();
  const item = items.find((entry) => String(entry.id) === id);

  if (!item) {
    return res.status(404).json({ message: "Decoration theme not found" });
  }

  res.json(item);
});

app.post("/api/decorations", upload.single("image"), createDecorationHandler);
app.post("/api/private/owner/decorations", upload.single("image"), createDecorationHandler);

app.put("/api/decorations/:id", (req, res) => {
  const id = String(req.params.id);
  const body = req.body || {};
  const items = readDecorations();
  const index = items.findIndex((entry) => String(entry.id) === id);

  if (index === -1) {
    return res.status(404).json({ message: "Decoration theme not found" });
  }

  const updated = {
    ...items[index],
    ...body,
    category: body.category ? normalizeText(body.category) : items[index].category,
    budget: body.budget ? normalizeText(body.budget) : items[index].budget
  };

  items[index] = updated;
  writeDecorations(items);

  res.json(updated);
});

app.delete("/api/decorations/:id", (req, res) => {
  const id = String(req.params.id);
  const items = readDecorations();
  const filtered = items.filter((entry) => String(entry.id) !== id);

  if (filtered.length === items.length) {
    return res.status(404).json({ message: "Decoration theme not found" });
  }

  writeDecorations(filtered);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Gallery API running on http://localhost:${PORT}`);
});
