// const express = require("express");
// const router = express.Router();
// const { register, login } = require("../controllers/authController");

// router.post("/register", register);
// router.post("/login", login);

// module.exports = router;


const express = require('express')

const SigninController = require('../Controller/SigninController')
const authMiddleware = require('../authMiddleware');


const route = express.Router()

route.post('/registerlogin',SigninController.adduser)

route.post('/login',SigninController.login)

route.get('/findall', SigninController.getuser)

route.delete('/deleteuser/:_id', SigninController.deleteuser)

route.put('/updateuser/:_id', SigninController.updateuser)


module.exports = route
