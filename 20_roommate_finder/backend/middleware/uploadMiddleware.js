const multer = require("multer");
const path = require("path");

// Storage Engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // ✅ Save files directly in "uploads/" folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // ✅ Unique filename
  }
});

// File Filter (Allow only images)
const fileFilter = (req, file, cb) => {
  if (!file) {
    cb(null, true); // ✅ Allow requests without an image
  } else if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

// Upload Middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // ✅ Max file size: 5MB
});

module.exports = upload;
