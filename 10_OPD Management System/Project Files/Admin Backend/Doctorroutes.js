// // const express = require('express');
// // const router = express.Router();
// // const doctorController = require('./doctorController');

// // // ==================== DOCTOR ROUTES ====================

// // // GET doctor by email - THIS WAS MISSING
// // router.get('/email/:email', doctorController.getDoctorByEmail);

// // // GET all doctors
// // router.get('/', doctorController.getAllDoctors);

// // // GET doctor by ID
// // router.get('/:id', doctorController.getDoctorById);

// // // UPDATE doctor
// // router.put('/:id', doctorController.updateDoctor);

// // // CREATE doctor
// // router.post('/', doctorController.createDoctor);

// // // DELETE doctor
// // router.delete('/:id', doctorController.deleteDoctor);

// // module.exports = router;

// const express = require('express');
// const router = express.Router();
// const Doctor = require('./DoctorModel');

// // GET all doctors
// router.get('/', async (req, res) => {
//     try {
//         const doctors = await Doctor.find().sort({ createdAt: -1 });
//         res.json({ success: true, data: doctors, count: doctors.length });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// });

// // ✅ GET doctor by email - YEH ROUTE ADD KARO
// router.get('/email/:email', async (req, res) => {
//     try {
//         const doctor = await Doctor.findOne({ email: req.params.email });
//         if (!doctor) {
//             return res.status(404).json({ 
//                 success: false, 
//                 message: 'Doctor not found with this email' 
//             });
//         }
//         res.json({ success: true, data: doctor });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// });

// // GET single doctor by ID
// router.get('/:id', async (req, res) => {
//     try {
//         const doctor = await Doctor.findById(req.params.id);
//         if (!doctor) {
//             return res.status(404).json({ success: false, message: 'Doctor not found' });
//         }
//         res.json({ success: true, data: doctor });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// });

// // POST new doctor
// router.post('/', async (req, res) => {
//     try {
//         const doctor = new Doctor(req.body);
//         await doctor.save();
//         res.status(201).json({ success: true, data: doctor, message: 'Doctor created' });
//     } catch (error) {
//         res.status(400).json({ success: false, message: error.message });
//     }
// });

// // PUT update doctor
// router.put('/:id', async (req, res) => {
//     try {
//         const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         if (!doctor) {
//             return res.status(404).json({ success: false, message: 'Doctor not found' });
//         }
//         res.json({ success: true, data: doctor, message: 'Doctor updated' });
//     } catch (error) {
//         res.status(400).json({ success: false, message: error.message });
//     }
// });

// // DELETE doctor
// router.delete('/:id', async (req, res) => {
//     try {
//         const doctor = await Doctor.findByIdAndDelete(req.params.id);
//         if (!doctor) {
//             return res.status(404).json({ success: false, message: 'Doctor not found' });
//         }
//         res.json({ success: true, message: 'Doctor deleted' });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const Doctor = require('./DoctorModel');

// GET all doctors
router.get('/', async (req, res) => {
    try {
        const doctors = await Doctor.find().sort({ createdAt: -1 });
        res.json({ success: true, data: doctors, count: doctors.length });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ✅ GET doctor by email - YEH ROUTE ADD KARO
router.get('/email/:email', async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ email: req.params.email });
        if (!doctor) {
            return res.status(404).json({ 
                success: false, 
                message: 'Doctor not found with this email' 
            });
        }
        res.json({ success: true, data: doctor });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET single doctor by ID
router.get('/:id', async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }
        res.json({ success: true, data: doctor });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST new doctor
router.post('/', async (req, res) => {
    try {
        const doctor = new Doctor(req.body);
        await doctor.save();
        res.status(201).json({ success: true, data: doctor, message: 'Doctor created' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// PUT update doctor
router.put('/:id', async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }
        res.json({ success: true, data: doctor, message: 'Doctor updated' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// DELETE doctor
router.delete('/:id', async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndDelete(req.params.id);
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }
        res.json({ success: true, message: 'Doctor deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;