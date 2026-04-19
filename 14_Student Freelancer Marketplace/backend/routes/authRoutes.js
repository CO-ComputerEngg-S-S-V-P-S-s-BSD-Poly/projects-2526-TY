const express = require('express');
const router = express.Router();
const authControllers = require('../controllers/authController');

router.post('/register', authControllers.adduser);
router.post('/login', authControllers.loginuser);
router.get('/findall', authControllers.findall);
router.delete('/deleteuser/:_id', authControllers.deleteuser);
router.put('/updateuser/:_id', authControllers.updateuser);

module.exports = router;
