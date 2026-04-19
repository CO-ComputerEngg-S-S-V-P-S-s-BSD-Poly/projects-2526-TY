const express = require('express');
const router = express.Router();
const appointmentController = require('./Appointmentcontroller.js');

router.post('/appointments', appointmentController.createAppointment);
router.get('/appointments', appointmentController.getAllAppointments);
router.get('/appointments/stats', appointmentController.getAppointmentStats);
router.get('/appointments/today', appointmentController.getTodaysAppointments);
router.put('/appointments/:id', appointmentController.updateAppointment);
router.patch('/appointments/:id/status', appointmentController.updateAppointmentStatus);
router.delete('/appointments/:id', appointmentController.deleteAppointment);

module.exports = router;