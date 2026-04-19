// const express = require("express");
// const router  = express.Router();

// const { registerUser, loginUser, getAllUsers } = require("../controllers/customerController");

// router.post("/register", registerUser);


// router.post("/login", loginUser);


// router.get("/", getAllUsers);

// module.exports = router;







const express = require("express");
const router  = express.Router();

const { registerUser, loginUser, logoutUser, getAllUsers } = require("../controllers/customerController");

// POST /api/users/register
router.post("/register", registerUser);

// POST /api/users/login
router.post("/login", loginUser);

// POST /api/users/logout  ✅ status Inactive karta hai
router.post("/logout", logoutUser);

// GET  /api/users  ← admin dashboard
router.get("/", getAllUsers);

module.exports = router;