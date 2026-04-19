// // patientroute.js
// const express = require('express');
// const router = express.Router();

// // ✅ PATH FIXED - controllers folder se import karo
// const patientController = require('./controllers/patientcontroller');

// console.log('📁 Patient routes loaded');

// // Public routes
// router.get('/', patientController.getAllPatients);
// router.get('/stats', patientController.getPatientStats);
// router.get('/search/:query', patientController.searchPatients);
// router.get('/:id', patientController.getPatientById);

// // Write routes
// router.post('/', patientController.registerPatient);
// router.put('/:id', patientController.updatePatient);
// router.put('/:id/discharge', patientController.dischargePatient);
// router.delete('/:id', patientController.deletePatient);

// module.exports = router;
// patientroute.js
const express = require('express');
const router = express.Router();

// ✅ PATH SAHI HAI - same folder mein hai
const patientController = require('./patientcontroller');

console.log('📁 Patient routes loaded');

// Public routes
router.get('/', patientController.getAllPatients);
router.get('/stats', patientController.getPatientStats);
router.get('/search/:query', patientController.searchPatients);
router.get('/:id', patientController.getPatientById);

// Write routes
router.post('/', patientController.registerPatient);
router.put('/:id', patientController.updatePatient);
router.put('/:id/discharge', patientController.dischargePatient);
router.delete('/:id', patientController.deletePatient);

module.exports = router;