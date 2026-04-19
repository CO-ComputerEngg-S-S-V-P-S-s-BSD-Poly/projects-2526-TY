const Staff = require('./Staffmodel');

// ==================== CREATE STAFF ====================
const createStaff = async (req, res) => {
    try {
        console.log("=".repeat(60));
        console.log("👥 STAFF CREATION REQUEST RECEIVED");
        console.log("=".repeat(60));
        console.log("Request Body:", JSON.stringify(req.body, null, 2));
        console.log("-".repeat(60));

        const {
            name, role, department, shift, status,
            contact, email, salary, joinDate
        } = req.body;

        // Validate required fields
        const missingFields = [];
        if (!name) missingFields.push('name');
        if (!role) missingFields.push('role');
        if (!shift) missingFields.push('shift');
        if (!contact) missingFields.push('contact');
        if (!email) missingFields.push('email');
        if (!joinDate) missingFields.push('joinDate');

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing",
                missingFields
            });
        }

        // Check for duplicate email
        const existingStaff = await Staff.findOne({ email: email.toLowerCase() });
        if (existingStaff) {
            return res.status(409).json({
                success: false,
                message: "Staff member with this email already exists"
            });
        }

        // Create staff ID based on role
        const prefix = role.substring(0, 3).toUpperCase();
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        const staffId = `${prefix}-${random}`;

        // Create new staff
        const newStaff = new Staff({
            staffId,
            name: name.trim(),
            role,
            department: department || '',
            shift,
            status: status || 'On Duty',
            attendance: '100%',
            contact,
            email: email.toLowerCase().trim(),
            salary: salary || '',
            joinDate,
            image: 'https://via.placeholder.com/50',
            createdBy: 'Admin',
            createdDate: new Date().toISOString().split('T')[0]
        });

        console.log("💾 Saving staff member with ID:", staffId);
        const savedStaff = await newStaff.save();

        console.log("✅ STAFF CREATED SUCCESSFULLY!");
        console.log("Staff ID:", savedStaff.staffId);
        console.log("Name:", savedStaff.name);

        res.status(201).json({
            success: true,
            message: "Staff member added successfully",
            data: savedStaff
        });

    } catch (error) {
        console.error("❌ ERROR:", error);

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Staff member with this email already exists"
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
            message: error.message || "Failed to add staff member"
        });
    }
};

// ==================== GET ALL STAFF ====================
const getAllStaff = async (req, res) => {
    try {
        console.log("📥 Fetching all staff members...");

        const staff = await Staff.find().sort({ createdAt: -1 });

        // Calculate statistics
        const stats = {
            total: staff.length,
            onDuty: staff.filter(s => s.status === 'On Duty').length,
            offDuty: staff.filter(s => s.status === 'Off Duty').length,
            onLeave: staff.filter(s => s.status === 'On Leave').length
        };

        console.log("✅ Staff fetched:", staff.length);
        console.log("📊 Stats:", stats);

        res.status(200).json({
            success: true,
            count: staff.length,
            data: staff,
            stats
        });

    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch staff"
        });
    }
};

// ==================== GET SINGLE STAFF ====================
const getStaffById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("🔍 Fetching staff with ID:", id);

        const staff = await Staff.findById(id);

        if (!staff) {
            return res.status(404).json({
                success: false,
                message: "Staff member not found"
            });
        }

        res.status(200).json({
            success: true,
            data: staff
        });

    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch staff"
        });
    }
};

// ==================== UPDATE STAFF ====================
const updateStaff = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("✏️ Updating staff with ID:", id);
        console.log("Update data:", req.body);

        // Check if staff exists
        const existingStaff = await Staff.findById(id);
        if (!existingStaff) {
            return res.status(404).json({
                success: false,
                message: "Staff member not found"
            });
        }

        // Check email uniqueness if changed
        if (req.body.email && req.body.email.toLowerCase() !== existingStaff.email) {
            const emailExists = await Staff.findOne({ 
                email: req.body.email.toLowerCase(),
                _id: { $ne: id }
            });
            if (emailExists) {
                return res.status(409).json({
                    success: false,
                    message: "Email already in use by another staff member"
                });
            }
        }

        // Update staff
        const updatedStaff = await Staff.findByIdAndUpdate(
            id,
            { ...req.body, email: req.body.email?.toLowerCase() },
            { new: true, runValidators: true }
        );

        console.log("✅ Staff updated successfully:", updatedStaff.name);

        res.status(200).json({
            success: true,
            message: "Staff member updated successfully",
            data: updatedStaff
        });

    } catch (error) {
        console.error("❌ Error:", error);

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Email already in use"
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
            message: error.message || "Failed to update staff"
        });
    }
};

// ==================== UPDATE STAFF STATUS ====================
const updateStaffStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        console.log(`🔄 Updating staff ${id} status to:`, status);

        const validStatuses = ['On Duty', 'Off Duty', 'On Leave'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status. Must be On Duty, Off Duty, or On Leave"
            });
        }

        const staff = await Staff.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!staff) {
            return res.status(404).json({
                success: false,
                message: "Staff member not found"
            });
        }

        console.log("✅ Status updated successfully");

        res.status(200).json({
            success: true,
            message: `Status updated to ${status}`,
            data: staff
        });

    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to update status"
        });
    }
};

// ==================== DELETE STAFF ====================
const deleteStaff = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("🗑️ Deleting staff with ID:", id);

        const staff = await Staff.findByIdAndDelete(id);

        if (!staff) {
            return res.status(404).json({
                success: false,
                message: "Staff member not found"
            });
        }

        console.log("✅ Staff deleted successfully:", staff.name);

        res.status(200).json({
            success: true,
            message: "Staff member deleted successfully",
            data: staff
        });

    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to delete staff"
        });
    }
};

// ==================== GET STAFF STATISTICS ====================
const getStaffStats = async (req, res) => {
    try {
        console.log("📊 Fetching staff statistics...");

        const total = await Staff.countDocuments();
        const onDuty = await Staff.countDocuments({ status: 'On Duty' });
        const offDuty = await Staff.countDocuments({ status: 'Off Duty' });
        const onLeave = await Staff.countDocuments({ status: 'On Leave' });

        // Get counts by role
        const byRole = {};
        const roles = ['Receptionist', 'Nurse', 'Lab Technician', 'Pharmacist', 'Accountant', 'Cleaner', 'Security', 'Doctor', 'Admin'];
        
        for (const role of roles) {
            byRole[role] = await Staff.countDocuments({ role });
        }

        const stats = {
            total,
            onDuty,
            offDuty,
            onLeave,
            byRole
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

// ==================== SEARCH STAFF ====================
const searchStaff = async (req, res) => {
    try {
        const { query } = req.query;
        console.log("🔍 Searching staff with query:", query);

        if (!query) {
            return res.status(400).json({
                success: false,
                message: "Search query is required"
            });
        }

        const staff = await Staff.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { role: { $regex: query, $options: 'i' } },
                { department: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } },
                { contact: { $regex: query, $options: 'i' } }
            ]
        }).sort({ createdAt: -1 });

        console.log(`✅ Found ${staff.length} staff members`);

        res.status(200).json({
            success: true,
            count: staff.length,
            data: staff
        });

    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to search staff"
        });
    }
};

module.exports = {
    createStaff,
    getAllStaff,
    getStaffById,
    updateStaff,
    updateStaffStatus,
    deleteStaff,
    getStaffStats,
    searchStaff
};