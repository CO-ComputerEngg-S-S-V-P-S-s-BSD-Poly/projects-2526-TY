const express = require("express");
const router = express.Router();
const BookingController = require("../controllers/BookingController");
const { photoUpload } = require('../fileUploads')

router.post("/create", photoUpload,BookingController.createBooking);

router.get("/pandit/:id", BookingController.getPanditBookings);

router.put("/confirm/:id", BookingController.confirmBooking);

router.get("/user/:id", BookingController.getUserBookings);

router.put("/reject/:id", BookingController.rejectBooking);

router.delete("/delete/:id", BookingController.deleteBooking);

module.exports = router;