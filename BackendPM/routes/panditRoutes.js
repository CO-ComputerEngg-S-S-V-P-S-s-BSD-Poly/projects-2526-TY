// const express = require("express");
// const router = express.Router();
// const auth = require("../middleware/authMiddleware");
// const {
//   addPanditProfile,
//   getPanditProfile
// } = require("../controllers/panditController");

// router.post("/profile", auth, addPanditProfile);
// router.get("/profile", auth, getPanditProfile);

// module.exports = router;


const express = require('express')

const panditController = require('../controllers/panditController')
const authMiddleware = require('../middleware/authMiddleware');

const { photoUpload } = require('../fileUploads')


const route = express.Router()

route.post('/registerlogin',photoUpload,panditController.adduser)

route.post('/login',panditController.login)

route.get('/by-specialization/:type', panditController.getPanditBySpecialization)



module.exports = route