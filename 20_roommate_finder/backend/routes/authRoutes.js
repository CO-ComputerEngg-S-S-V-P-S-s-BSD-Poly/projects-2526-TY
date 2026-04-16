const express = require("express");
const upload = require("../middleware/uploadMiddleware"); 
const { registerUser, getOtpForLogin, verifyLoginOtp } = require("../controllers/authController");

const router = express.Router();

// ✅ Register User (Upload to "uploads/")
router.post("/register", upload.single("profilePic"), registerUser);

// ✅ Login APIs
router.post("/login/get-otp", getOtpForLogin);
router.post("/login/verify-otp", verifyLoginOtp);

module.exports = router;
