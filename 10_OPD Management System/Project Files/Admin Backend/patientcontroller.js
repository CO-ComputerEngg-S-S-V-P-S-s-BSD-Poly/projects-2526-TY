// // controllers/patientcontroller.js
// const Patient = require('../models/patientmodel');

// // Get all patients
// exports.getAllPatients = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 50;
//     const skip = (page - 1) * limit;

//     const patients = await Patient.find()
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit);

//     const total = await Patient.countDocuments();

//     res.json({
//       success: true,
//       data: patients,
//       pagination: {
//         page,
//         limit,
//         total,
//         pages: Math.ceil(total / limit)
//       }
//     });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Get patient statistics
// exports.getPatientStats = async (req, res) => {
//   try {
//     const total = await Patient.countDocuments();
    
//     const [male, female, other] = await Promise.all([
//       Patient.countDocuments({ gender: 'Male' }),
//       Patient.countDocuments({ gender: 'Female' }),
//       Patient.countDocuments({ gender: 'Other' })
//     ]);
    
//     const [admitted, icu, discharged] = await Promise.all([
//       Patient.countDocuments({ status: 'Admitted' }),
//       Patient.countDocuments({ status: 'ICU' }),
//       Patient.countDocuments({ status: 'Discharged' })
//     ]);

//     res.json({
//       success: true,
//       data: {
//         total, male, female, other,
//         admitted, icu, discharged
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Register new patient
// exports.registerPatient = async (req, res) => {
//   try {
//     // Check for duplicate
//     const existing = await Patient.findOne({
//       $or: [
//         { email: req.body.email },
//         { phone: req.body.phone }
//       ]
//     });

//     if (existing) {
//       return res.status(400).json({
//         success: false,
//         message: 'Patient with this email or phone already exists'
//       });
//     }

//     const patient = new Patient(req.body);
//     await patient.save();

//     res.status(201).json({
//       success: true,
//       message: 'Patient registered successfully',
//       data: patient
//     });
//   } catch (error) {
//     if (error.code === 11000) {
//       return res.status(400).json({
//         success: false,
//         message: 'Duplicate entry - email or phone already exists'
//       });
//     }
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Get single patient
// exports.getPatientById = async (req, res) => {
//   try {
//     const patient = await Patient.findById(req.params.id);
//     if (!patient) {
//       return res.status(404).json({ success: false, message: 'Patient not found' });
//     }
//     res.json({ success: true, data: patient });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Update patient
// exports.updatePatient = async (req, res) => {
//   try {
//     const patient = await Patient.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true, runValidators: true }
//     );

//     if (!patient) {
//       return res.status(404).json({ success: false, message: 'Patient not found' });
//     }

//     res.json({
//       success: true,
//       message: 'Patient updated successfully',
//       data: patient
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Delete patient
// exports.deletePatient = async (req, res) => {
//   try {
//     const patient = await Patient.findByIdAndDelete(req.params.id);
//     if (!patient) {
//       return res.status(404).json({ success: false, message: 'Patient not found' });
//     }
//     res.json({ success: true, message: 'Patient deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Discharge patient
// exports.dischargePatient = async (req, res) => {
//   try {
//     const patient = await Patient.findById(req.params.id);
//     if (!patient) {
//       return res.status(404).json({ success: false, message: 'Patient not found' });
//     }

//     patient.status = 'Discharged';
//     patient.bed = null;
//     patient.dischargedDate = new Date().toISOString().split('T')[0];
    
//     await patient.save();

//     res.json({
//       success: true,
//       message: 'Patient discharged successfully',
//       data: patient
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Search patients
// exports.searchPatients = async (req, res) => {
//   try {
//     const { query } = req.params;
    
//     const patients = await Patient.find({
//       $or: [
//         { patientName: { $regex: query, $options: 'i' } },
//         { email: { $regex: query, $options: 'i' } },
//         { phone: { $regex: query, $options: 'i' } },
//         { disease: { $regex: query, $options: 'i' } }
//       ]
//     }).limit(20);

//     res.json({ success: true, data: patients });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// patientcontroller.js
// ✅ PATH SAHI HAI - same folder mein hai
const Patient = require('./patientmodel');

console.log('📁 Patient controller loaded');

// Get all patients
exports.getAllPatients = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const patients = await Patient.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Patient.countDocuments();

    res.json({
      success: true,
      data: patients,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get patient statistics
exports.getPatientStats = async (req, res) => {
  try {
    const total = await Patient.countDocuments();
    
    const [male, female, other] = await Promise.all([
      Patient.countDocuments({ gender: 'Male' }),
      Patient.countDocuments({ gender: 'Female' }),
      Patient.countDocuments({ gender: 'Other' })
    ]);
    
    const [admitted, icu, discharged] = await Promise.all([
      Patient.countDocuments({ status: 'Admitted' }),
      Patient.countDocuments({ status: 'ICU' }),
      Patient.countDocuments({ status: 'Discharged' })
    ]);

    res.json({
      success: true,
      data: {
        total, male, female, other,
        admitted, icu, discharged
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Register new patient
exports.registerPatient = async (req, res) => {
  try {
    // Check for duplicate
    const existing = await Patient.findOne({
      $or: [
        { email: req.body.email },
        { phone: req.body.phone }
      ]
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Patient with this email or phone already exists'
      });
    }

    const patient = new Patient(req.body);
    await patient.save();

    res.status(201).json({
      success: true,
      message: 'Patient registered successfully',
      data: patient
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate entry - email or phone already exists'
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single patient
exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }
    res.json({ success: true, data: patient });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update patient
exports.updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    res.json({
      success: true,
      message: 'Patient updated successfully',
      data: patient
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete patient
exports.deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }
    res.json({ success: true, message: 'Patient deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Discharge patient
exports.dischargePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    patient.status = 'Discharged';
    patient.bed = null;
    patient.dischargedDate = new Date().toISOString().split('T')[0];
    
    await patient.save();

    res.json({
      success: true,
      message: 'Patient discharged successfully',
      data: patient
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Search patients
exports.searchPatients = async (req, res) => {
  try {
    const { query } = req.params;
    
    const patients = await Patient.find({
      $or: [
        { patientName: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { phone: { $regex: query, $options: 'i' } },
        { disease: { $regex: query, $options: 'i' } }
      ]
    }).limit(20);

    res.json({ success: true, data: patients });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};