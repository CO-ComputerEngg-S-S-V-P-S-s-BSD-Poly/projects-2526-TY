// const Doctor = require('./DoctorModel');

// // ==================== GET DOCTOR BY EMAIL ====================
// exports.getDoctorByEmail = async (req, res) => {
//     try {
//         const { email } = req.params;
//         console.log("Searching for doctor with email:", email); // Add this for debugging
        
//         const doctor = await Doctor.findOne({ email });
        
//         if (!doctor) {
//             console.log("Doctor not found with email:", email);
//             return res.status(404).json({
//                 success: false,
//                 message: 'Doctor not found with this email'
//             });
//         }

//         console.log("Doctor found:", doctor.name);
//         res.status(200).json({
//             success: true,
//             data: doctor
//         });
//     } catch (error) {
//         console.error("Error in getDoctorByEmail:", error);
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

// // ==================== GET ALL DOCTORS ====================
// exports.getAllDoctors = async (req, res) => {
//     try {
//         const doctors = await Doctor.find().sort({ createdAt: -1 });
        
//         res.status(200).json({
//             success: true,
//             count: doctors.length,
//             data: doctors
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

// // ==================== GET DOCTOR BY ID ====================
// exports.getDoctorById = async (req, res) => {
//     try {
//         const doctor = await Doctor.findById(req.params.id);
        
//         if (!doctor) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Doctor not found'
//             });
//         }

//         res.status(200).json({
//             success: true,
//             data: doctor
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

// // ==================== UPDATE DOCTOR ====================
// exports.updateDoctor = async (req, res) => {
//     try {
//         const { id } = req.params;
        
//         // Check if email is being updated and already exists
//         if (req.body.email) {
//             const existingDoctor = await Doctor.findOne({
//                 email: req.body.email,
//                 _id: { $ne: id }
//             });
            
//             if (existingDoctor) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Email already exists for another doctor'
//                 });
//             }
//         }

//         // Check if license number is being updated and already exists
//         if (req.body.licenseNumber) {
//             const existingLicense = await Doctor.findOne({
//                 licenseNumber: req.body.licenseNumber,
//                 _id: { $ne: id }
//             });
            
//             if (existingLicense) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'License number already exists for another doctor'
//                 });
//             }
//         }

//         const doctor = await Doctor.findByIdAndUpdate(
//             id,
//             req.body,
//             { new: true, runValidators: true }
//         );

//         if (!doctor) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Doctor not found'
//             });
//         }

//         res.status(200).json({
//             success: true,
//             message: 'Doctor updated successfully',
//             data: doctor
//         });
//     } catch (error) {
//         res.status(400).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

// // ==================== CREATE DOCTOR ====================
// exports.createDoctor = async (req, res) => {
//     try {
//         // Check if email exists
//         const existingEmail = await Doctor.findOne({ email: req.body.email });
//         if (existingEmail) {
//             return res.status(400).json({success: false,
//                 message: 'Email already exists'
//             });
//         }

//         // Check if license exists
//         const existingLicense = await Doctor.findOne({ licenseNumber: req.body.licenseNumber });
//         if (existingLicense) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'License number already exists'
//             });
//         }

//         const doctor = new Doctor(req.body);
//         await doctor.save();

//         res.status(201).json({
//             success: true,
//             message: 'Doctor created successfully',
//             data: doctor
//         });
//     } catch (error) {
//         res.status(400).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

// // ==================== DELETE DOCTOR ====================
// exports.deleteDoctor = async (req, res) => {
//     try {
//         const doctor = await Doctor.findByIdAndDelete(req.params.id);

//         if (!doctor) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Doctor not found'
//             });
//         }

//         res.status(200).json({
//             success: true,
//             message: 'Doctor deleted successfully'
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };


const Doctor = require('./DoctorModel');

// ==================== GET DOCTOR BY EMAIL ====================
exports.getDoctorByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        console.log("Searching for doctor with email:", email); // Add this for debugging
        
        const doctor = await Doctor.findOne({ email });
        
        if (!doctor) {
            console.log("Doctor not found with email:", email);
            return res.status(404).json({
                success: false,
                message: 'Doctor not found with this email'
            });
        }

        console.log("Doctor found:", doctor.name);
        res.status(200).json({
            success: true,
            data: doctor
        });
    } catch (error) {
        console.error("Error in getDoctorByEmail:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==================== GET ALL DOCTORS ====================
exports.getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find().sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: doctors.length,
            data: doctors
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==================== GET DOCTOR BY ID ====================
exports.getDoctorById = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        res.status(200).json({
            success: true,
            data: doctor
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==================== UPDATE DOCTOR ====================
exports.updateDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if email is being updated and already exists
        if (req.body.email) {
            const existingDoctor = await Doctor.findOne({
                email: req.body.email,
                _id: { $ne: id }
            });
            
            if (existingDoctor) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already exists for another doctor'
                });
            }
        }

        // Check if license number is being updated and already exists
        if (req.body.licenseNumber) {
            const existingLicense = await Doctor.findOne({
                licenseNumber: req.body.licenseNumber,
                _id: { $ne: id }
            });
            
            if (existingLicense) {
                return res.status(400).json({
                    success: false,
                    message: 'License number already exists for another doctor'
                });
            }
        }

        const doctor = await Doctor.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Doctor updated successfully',
            data: doctor
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ==================== CREATE DOCTOR ====================
exports.createDoctor = async (req, res) => {
    try {
        // Check if email exists
        const existingEmail = await Doctor.findOne({ email: req.body.email });
        if (existingEmail) {
            return res.status(400).json({success: false,
                message: 'Email already exists'
            });
        }

        // Check if license exists
        const existingLicense = await Doctor.findOne({ licenseNumber: req.body.licenseNumber });
        if (existingLicense) {
            return res.status(400).json({
                success: false,
                message: 'License number already exists'
            });
        }

        const doctor = new Doctor(req.body);
        await doctor.save();

        res.status(201).json({
            success: true,
            message: 'Doctor created successfully',
            data: doctor
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ==================== DELETE DOCTOR ====================
exports.deleteDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndDelete(req.params.id);

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Doctor deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};