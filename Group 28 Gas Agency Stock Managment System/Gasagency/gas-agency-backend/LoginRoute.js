const express = require("express");
const router = express.Router();
const { login } = require("./LoginController");

router.post("/login", login);

module.exports = router;