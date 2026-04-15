const express = require('express')

const UserController = require('../controllers/UserController')
const authMiddleware = require('../middleware/authMiddleware');


const route = express.Router()

route.post('/registerlogin',UserController.registerUser)

route.post('/login',UserController.loginUser)

module.exports = route

