const PatientAdmission = require('./Admitpatientmodel');
const axios = require('axios');

// Search patients
exports.searchPatients = async (req, res) => {
    try {
        const { query } = req.query;
        
        if (!query) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        const patients = await PatientAdmission.find({
            $or: [
                { patientName: { $regex: query, $options: 'i' } },
                { phone: { $regex: query, $options: 'i' } }
            ]
        }).limit(10);

        res.status(200).json({
            success: true,
            data: patients
        });
    } catch (error) {
        console.error('Error searching patients:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get available beds
exports.getAvailableBeds = async (req, res) => {
    try {
        // Try to get beds from management system first
        try {
            const bedResponse = await axios.get('http://localhost:8005/api/beds');
            const allBeds = bedResponse.data.data || bedResponse.data;
            
            const occupiedBeds = await PatientAdmission.find({ 
                status: 'Admitted' 
            }).select('bedNo');
            
            const occupiedBedNumbers = occupiedBeds.map(adm => adm.bedNo);
            
            // Filter available beds
            const availableBeds = allBeds
                .filter(bed => !occupiedBedNumbers.includes(bed.bedNumber))
                .map(bed => bed.bedNumber);
            
            return res.status(200).json({
                success: true,
                totalBeds: allBeds.length,
                occupiedBeds: occupiedBedNumbers.length,
                availableBeds: availableBeds.length,
                data: availableBeds
            });
        } catch (error) {
            // Fallback to default bed list
            const allBeds = [
                "B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10"
            ];

            const occupiedBeds = await PatientAdmission.find({ 
                status: 'Admitted' 
            }).select('bedNo');

            const occupiedBedNumbers = occupiedBeds.map(adm => adm.bedNo);
            const availableBeds = allBeds.filter(bed => !occupiedBedNumbers.includes(bed));

            res.status(200).json({
                success: true,
                totalBeds: allBeds.length,
                occupiedBeds: occupiedBedNumbers.length,
                availableBeds: availableBeds.length,
                data: availableBeds
            });
        }
    } catch (error) {
        console.error('Error fetching available beds:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all admissions
exports.getAllAdmissions = async (req, res) => {
    try {
        const admissions = await PatientAdmission.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: admissions.length,
            data: admissions
        });
    } catch (error) {
        console.error('Error fetching admissions:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get admission by ID
exports.getAdmissionById = async (req, res) => {
    try {
        const admission = await PatientAdmission.findOne({ id: req.params.id });
        
        if (!admission) {
            return res.status(404).json({
                success: false,
                message: 'Admission not found'
            });
        }

        res.status(200).json({
            success: true,
            data: admission
        });
    } catch (error) {
        console.error('Error fetching admission:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ========== FIXED: Create new admission with bed sync ==========
exports.createAdmission = async (req, res) => {
    try {
        const admissionData = req.body;
        
        // Check if bed is already occupied in our system
        const existingAdmission = await PatientAdmission.findOne({
            bedNo: admissionData.bedNo,
            status: 'Admitted'
        });

        if (existingAdmission) {
            return res.status(400).json({
                success: false,
                message: `Bed ${admissionData.bedNo} is already occupied`
            });
        }

        const newAdmission = new PatientAdmission(admissionData);
        await newAdmission.save();

        // ===== IMPORTANT: Update bed status in bed management system =====
        try {
            console.log(`🔄 Updating bed ${admissionData.bedNo} status to Occupied...`);
            
            // Get all beds from management system
            const bedResponse = await axios.get('http://localhost:8005/api/beds');
            const beds = bedResponse.data.data || bedResponse.data;
            
            // Find the bed with matching bedNumber
            const bed = beds.find(b => b.bedNumber === admissionData.bedNo);
            
            if (bed && bed._id) {
                // Update bed status to 'Occupied'
                await axios.put(`http://localhost:8005/api/beds/${bed._id}`, {
                    bedNumber: bed.bedNumber,
                    status: 'Occupied'
                });
                console.log(`✅ Bed ${admissionData.bedNo} status updated to Occupied`);
            } else {
                console.log(`⚠️ Bed ${admissionData.bedNo} not found in management system`);
                console.log('Available beds:', beds.map(b => b.bedNumber));
            }
        } catch (bedError) {
            console.error('❌ Failed to update bed status:', bedError.message);
        }

        res.status(201).json({
            success: true,
            message: 'Patient admitted successfully',
            data: newAdmission
        });
    } catch (error) {
        console.error('Error creating admission:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update admission
exports.updateAdmission = async (req, res) => {
    try {
        const admission = await PatientAdmission.findOne({ id: req.params.id });
        
        if (!admission) {
            return res.status(404).json({
                success: false,
                message: 'Admission not found'
            });
        }

        const oldBedNo = admission.bedNo;
        const newBedNo = req.body.bedNo || oldBedNo;
        const oldStatus = admission.status;
        const newStatus = req.body.status || oldStatus;

        // If bed number is being changed, check if new bed is available
        if (newBedNo !== oldBedNo && newStatus === 'Admitted') {
            const bedOccupied = await PatientAdmission.findOne({
                bedNo: newBedNo,
                status: 'Admitted',
                _id: { $ne: admission._id }
            });

            if (bedOccupied) {
                return res.status(400).json({
                    success: false,
                    message: `Bed ${newBedNo} is already occupied`
                });
            }
        }

        const updatedAdmission = await PatientAdmission.findOneAndUpdate(
            { id: req.params.id },
            req.body,
            { new: true, runValidators: true }
        );

        // ===== Sync bed status changes =====
        try {
            const bedResponse = await axios.get('http://localhost:8005/api/beds');
            const beds = bedResponse.data.data || bedResponse.data;
            
            // If bed number changed, update both old and new beds
            if (newBedNo !== oldBedNo) {
                // Set old bed to Available
                const oldBed = beds.find(b => b.bedNumber === oldBedNo);
                if (oldBed && oldBed._id) {
                    await axios.put(`http://localhost:8005/api/beds/${oldBed._id}`, {
                        bedNumber: oldBed.bedNumber,
                        status: 'Available'
                    });
                    console.log(`✅ Old bed ${oldBedNo} set to Available`);
                }
                
                // Set new bed to Occupied (if status is Admitted)
                if (newStatus === 'Admitted') {
                    const newBed = beds.find(b => b.bedNumber === newBedNo);
                    if (newBed && newBed._id) {
                        await axios.put(`http://localhost:8005/api/beds/${newBed._id}`, {
                            bedNumber: newBed.bedNumber,
                            status: 'Occupied'
                        });
                        console.log(`✅ New bed ${newBedNo} set to Occupied`);
                    }
                }
            } 
            // If status changed from Admitted to Discharged
            else if (oldStatus === 'Admitted' && newStatus === 'Discharged') {
                const bed = beds.find(b => b.bedNumber === newBedNo);
                if (bed && bed._id) {
                    await axios.put(`http://localhost:8005/api/beds/${bed._id}`, {
                        bedNumber: bed.bedNumber,
                        status: 'Available'
                    });
                    console.log(`✅ Bed ${newBedNo} set to Available`);
                }
            }
        } catch (bedError) {
            console.error('❌ Failed to sync bed status:', bedError.message);
        }

        res.status(200).json({
            success: true,
            message: 'Admission updated successfully',
            data: updatedAdmission
        });
    } catch (error) {
        console.error('Error updating admission:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Discharge patient
exports.dischargePatient = async (req, res) => {
    try {
        const { dischargeDate, dischargeNotes, dischargeType } = req.body;
        
        const admission = await PatientAdmission.findOne({ id: req.params.id });
        
        if (!admission) {
            return res.status(404).json({
                success: false,
                message: 'Admission not found'
            });
        }

        if (admission.status === 'Discharged') {
            return res.status(400).json({
                success: false,
                message: 'Patient is already discharged'
            });
        }

        const bedNo = admission.bedNo;

        admission.status = 'Discharged';
        admission.dischargeDate = dischargeDate;
        admission.dischargeNotes = dischargeNotes || '';
        admission.dischargeType = dischargeType || 'Recovered';
        
        await admission.save();

        // ===== Update bed status to Available =====
        try {
            const bedResponse = await axios.get('http://localhost:8005/api/beds');
            const beds = bedResponse.data.data || bedResponse.data;
            
            const bed = beds.find(b => b.bedNumber === bedNo);
            if (bed && bed._id) {
                await axios.put(`http://localhost:8005/api/beds/${bed._id}`, {
                    bedNumber: bed.bedNumber,
                    status: 'Available'
                });
                console.log(`✅ Bed ${bedNo} set to Available after discharge`);
            }
        } catch (bedError) {
            console.error('❌ Failed to update bed status:', bedError.message);
        }

        res.status(200).json({
            success: true,
            message: 'Patient discharged successfully',
            data: admission
        });
    } catch (error) {
        console.error('Error discharging patient:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete admission
exports.deleteAdmission = async (req, res) => {
    try {
        const admission = await PatientAdmission.findOne({ id: req.params.id });
        
        if (!admission) {
            return res.status(404).json({
                success: false,
                message: 'Admission not found'
            });
        }

        // If deleting an admitted patient, free up the bed
        if (admission.status === 'Admitted') {
            try {
                const bedResponse = await axios.get('http://localhost:8005/api/beds');
                const beds = bedResponse.data.data || bedResponse.data;
                
                const bed = beds.find(b => b.bedNumber === admission.bedNo);
                if (bed && bed._id) {
                    await axios.put(`http://localhost:8005/api/beds/${bed._id}`, {
                        bedNumber: bed.bedNumber,
                        status: 'Available'
                    });
                    console.log(`✅ Bed ${admission.bedNo} set to Available after deletion`);
                }
            } catch (bedError) {
                console.error('❌ Failed to update bed status:', bedError.message);
            }
        }

        await PatientAdmission.findOneAndDelete({ id: req.params.id });

        res.status(200).json({
            success: true,
            message: 'Admission deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting admission:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};