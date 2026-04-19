// const express = require("express");
// const router = express.Router();
// const { register, login } = require("../controllers/authController");

// router.post("/register", register);
// router.post("/login", login);

// module.exports = router;


// const express = require('express')

// const SigninController = require('../Controller/SigninController')
// const authMiddleware = require('../authMiddleware');


// const route = express.Router()

// route.post('/registerlogin',SigninController.adduser)

// route.post('/login',SigninController.login)

// route.get('/findall', SigninController.getuser)

// route.delete('/deleteuser/:_id', SigninController.deleteuser)

// route.put('/updateuser/:_id', SigninController.updateuser)


// module.exports = route
// const express = require("express");
// const router = express.Router();
// const { registerUser, loginUser } = require("../controllers/authController");

// router.post("/register", registerUser);
//  router.post("/login", loginUser);

// module.exports = router;

// import express from "express";
// import { registerUser, loginUser } from "../controllers/authController.js";

// const router = express.Router();

// router.post("/register", registerUser);
// router.post("/login", loginUser);

// export default router;

// #######################################################################

// const express = require("express");
// const router = express.Router();
// const { registerUser, loginUser } = require("../controllers/authController");

// // Routes set karo
// router.post("/register", registerUser);
// router.post("/login", loginUser);

// module.exports = router;

// #################################################################################




const express = require("express");
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  logoutUser,     // NEW!
  getAllUsers     // NEW!
} = require("../controllers/authController");

// ========== ROUTES ==========

// POST /api/auth/register
router.post("/register", registerUser);

// POST /api/auth/login
router.post("/login", loginUser);

// POST /api/auth/logout (NEW!)
router.post("/logout", logoutUser);

// GET /api/auth/users (NEW! - For Admin Dashboard)
router.get("/users", getAllUsers);

module.exports = router;


