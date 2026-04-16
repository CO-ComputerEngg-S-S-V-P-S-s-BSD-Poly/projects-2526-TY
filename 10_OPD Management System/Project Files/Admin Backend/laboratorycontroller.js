const Laboratory = require('./laboratorymodel');

// ==================== CREATE LAB TEST ====================
const createLabTest = async (req, res) => {
    try {
        console.log("=".repeat(60));
        console.log("🧪 LAB TEST CREATION REQUEST RECEIVED");
        console.log("=".repeat(60));
        console.log("Request Body:", JSON.stringify(req.body, null, 2));
        console.log("-".repeat(60));

        const { patient, test, doctor, priority, notes, patientId, doctorId } = req.body;

        // Validate required fields
        const missingFields = [];
        if (!patient) missingFields.push('patient');
        if (!test) missingFields.push('test');
        if (!doctor) missingFields.push('doctor');

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing",
                missingFields
            });
        }

        // Create new lab test
        const newLabTest = new Laboratory({
            patient: patient.trim(),
            patientId: patientId || '',
            test,
            doctor: doctor.trim(),
            doctorId: doctorId || '',
            priority: priority || 'Normal',
            notes: notes || '',
            status: 'Pending',
            createdBy: req.user?.name || 'Receptionist'
        });

        console.log("💾 Saving lab test...");
        const savedTest = await newLabTest.save();

        console.log("✅ LAB TEST CREATED SUCCESSFULLY!");
        console.log("Test ID:", savedTest.testId);
        console.log("Patient:", savedTest.patient);
        console.log("Test:", savedTest.test);

        res.status(201).json({
            success: true,
            message: "Lab test request created successfully",
            data: savedTest
        });

    } catch (error) {
        console.error("❌ ERROR:", error);

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Duplicate test ID generated. Please try again."
            });
        }

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }

        res.status(500).json({
            success: false,
            message: error.message || "Failed to create lab test"
        });
    }
};

// ==================== GET ALL LAB TESTS ====================
const getAllLabTests = async (req, res) => {
    try {
        console.log("📥 Fetching all lab tests...");

        const tests = await Laboratory.find().sort({ createdAt: -1 });

        // Calculate statistics
        const stats = {
            total: tests.length,
            pending: tests.filter(t => t.status === 'Pending').length,
            inProgress: tests.filter(t => t.status === 'In Progress').length,
            completed: tests.filter(t => t.status === 'Completed').length,
            cancelled: tests.filter(t => t.status === 'Cancelled').length
        };

        console.log("✅ Lab tests fetched:", tests.length);
        console.log("📊 Stats:", stats);

        res.status(200).json({
            success: true,
            count: tests.length,
            data: tests,
            stats
        });

    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch lab tests"
        });
    }
};

// ==================== GET SINGLE LAB TEST ====================
const getLabTestById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("🔍 Fetching lab test with ID:", id);

        const test = await Laboratory.findById(id);

        if (!test) {
            return res.status(404).json({
                success: false,
                message: "Lab test not found"
            });
        }

        res.status(200).json({
            success: true,
            data: test
        });

    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch lab test"
        });
    }
};

// ==================== UPDATE LAB TEST ====================
const updateLabTest = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("✏️ Updating lab test with ID:", id);
        console.log("Update data:", req.body);

        const test = await Laboratory.findByIdAndUpdate(
            id,
            { ...req.body, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );

        if (!test) {
            return res.status(404).json({
                success: false,
                message: "Lab test not found"
            });
        }

        console.log("✅ Lab test updated successfully");

        res.status(200).json({
            success: true,
            message: "Lab test updated successfully",
            data: test
        });

    } catch (error) {
        console.error("❌ Error:", error);

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }

        res.status(500).json({
            success: false,
            message: error.message || "Failed to update lab test"
        });
    }
};

// ==================== UPDATE TEST RESULTS ====================
const updateTestResults = async (req, res) => {
    try {
        const { id } = req.params;
        const { results, technician, status } = req.body;

        console.log(`📝 Updating results for test ID: ${id}`);
        console.log("Results:", results);
        console.log("Technician:", technician);

        if (!results || !technician) {
            return res.status(400).json({
                success: false,
                message: "Results and technician name are required"
            });
        }

        const test = await Laboratory.findByIdAndUpdate(
            id,
            {
                results,
                technician,
                status: status || 'Completed',
                updatedAt: Date.now()
            },
            { new: true, runValidators: true }
        );

        if (!test) {
            return res.status(404).json({
                success: false,
                message: "Lab test not found"
            });
        }

        console.log("✅ Test results updated successfully");

        res.status(200).json({
            success: true,
            message: "Test results saved successfully",
            data: test
        });

    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to update results"
        });
    }
};

// ==================== UPDATE TEST STATUS ====================
const updateTestStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        console.log(`🔄 Updating test ${id} status to:`, status);

        const validStatuses = ['Pending', 'In Progress', 'Completed', 'Cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status. Must be Pending, In Progress, Completed, or Cancelled"
            });
        }

        const test = await Laboratory.findByIdAndUpdate(
            id,
            { status, updatedAt: Date.now() },
            { new: true }
        );

        if (!test) {
            return res.status(404).json({
                success: false,
                message: "Lab test not found"
            });
        }

        console.log("✅ Test status updated successfully");

        res.status(200).json({
            success: true,
            message: `Status updated to ${status}`,
            data: test
        });

    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to update status"
        });
    }
};

// ==================== DELETE LAB TEST ====================
const deleteLabTest = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("🗑️ Deleting lab test with ID:", id);

        const test = await Laboratory.findByIdAndDelete(id);

        if (!test) {
            return res.status(404).json({
                success: false,
                message: "Lab test not found"
            });
        }

        console.log("✅ Lab test deleted successfully:", test.testId);

        res.status(200).json({
            success: true,
            message: "Lab test deleted successfully",
            data: test
        });

    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to delete lab test"
        });
    }
};

// ==================== GET LAB STATISTICS ====================
const getLabStats = async (req, res) => {
    try {
        console.log("📊 Fetching laboratory statistics...");

        const total = await Laboratory.countDocuments();
        const pending = await Laboratory.countDocuments({ status: 'Pending' });
        const inProgress = await Laboratory.countDocuments({ status: 'In Progress' });
        const completed = await Laboratory.countDocuments({ status: 'Completed' });
        const cancelled = await Laboratory.countDocuments({ status: 'Cancelled' });

        // Get counts by test type
        const byTestType = {};
        const testTypes = ['Blood Test', 'Urine Test', 'X-Ray', 'MRI Scan', 'CT Scan', 'Blood Sugar', 'ECG', 'Ultrasound'];
        
        for (const type of testTypes) {
            byTestType[type] = await Laboratory.countDocuments({ test: type });
        }

        const stats = {
            total,
            pending,
            inProgress,
            completed,
            cancelled,
            byTestType
        };

        console.log("✅ Stats:", stats);

        res.status(200).json({
            success: true,
            data: stats
        });

    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch statistics"
        });
    }
};

// ==================== SEARCH LAB TESTS ====================
const searchLabTests = async (req, res) => {
    try {
        const { query } = req.query;
        console.log("🔍 Searching lab tests with query:", query);

        if (!query) {
            return res.status(400).json({
                success: false,
                message: "Search query is required"
            });
        }

        const tests = await Laboratory.find({
            $or: [
                { patient: { $regex: query, $options: 'i' } },
                { test: { $regex: query, $options: 'i' } },
                { testId: { $regex: query, $options: 'i' } },
                { doctor: { $regex: query, $options: 'i' } },
                { technician: { $regex: query, $options: 'i' } }
            ]
        }).sort({ createdAt: -1 });

        console.log(`✅ Found ${tests.length} lab tests`);

        res.status(200).json({
            success: true,
            count: tests.length,
            data: tests
        });

    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to search lab tests"
        });
    }
};

module.exports = {
    createLabTest,
    getAllLabTests,
    getLabTestById,
    updateLabTest,
    updateTestResults,
    updateTestStatus,
    deleteLabTest,
    getLabStats,
    searchLabTests
};