const Machinery = require('./machinerymodel');

// ==================== CREATE MACHINERY ====================
const createMachinery = async (req, res) => {
    try {
        console.log("=".repeat(60));
        console.log("🏭 MACHINERY CREATION REQUEST RECEIVED");
        console.log("=".repeat(60));
        console.log("Request Body:", JSON.stringify(req.body, null, 2));
        console.log("-".repeat(60));

        const { name, model, manufacturer, location, status, cost, warranty, notes } = req.body;

        // Validate required fields
        const missingFields = [];
        if (!name) missingFields.push('name');
        if (!model) missingFields.push('model');
        if (!manufacturer) missingFields.push('manufacturer');
        if (!location) missingFields.push('location');

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing",
                missingFields
            });
        }

        // Calculate next service date (default 1 month from now)
        const nextServiceDate = new Date();
        nextServiceDate.setMonth(nextServiceDate.getMonth() + 1);
        const nextService = nextServiceDate.toISOString().split('T')[0];

        // Create new machinery
        const newMachinery = new Machinery({
            name: name.trim(),
            model: model.trim(),
            manufacturer: manufacturer.trim(),
            location: location.trim(),
            status: status || 'Operational',
            cost: cost || '',
            warranty: warranty || '',
            notes: notes || '',
            lastService: new Date().toISOString().split('T')[0],
            nextService: nextService,
            createdBy: req.user?.name || 'Admin'
        });

        console.log("💾 Saving machinery...");
        const savedMachinery = await newMachinery.save();

        console.log("✅ MACHINERY CREATED SUCCESSFULLY!");
        console.log("Equipment ID:", savedMachinery.equipmentId);
        console.log("Name:", savedMachinery.name);
        console.log("Model:", savedMachinery.model);

        res.status(201).json({
            success: true,
            message: "Equipment added successfully",
            data: savedMachinery
        });

    } catch (error) {
        console.error("❌ ERROR:", error);

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Duplicate equipment ID generated. Please try again."
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
            message: error.message || "Failed to add equipment"
        });
    }
};

// ==================== GET ALL MACHINERY ====================
const getAllMachinery = async (req, res) => {
    try {
        console.log("📥 Fetching all machinery...");

        const machinery = await Machinery.find().sort({ createdAt: -1 });

        // Calculate statistics
        const stats = {
            total: machinery.length,
            operational: machinery.filter(m => m.status === 'Operational').length,
            maintenance: machinery.filter(m => m.status === 'Under Maintenance').length,
            outOfService: machinery.filter(m => m.status === 'Out of Service').length
        };

        console.log("✅ Machinery fetched:", machinery.length);
        console.log("📊 Stats:", stats);

        res.status(200).json({
            success: true,
            count: machinery.length,
            data: machinery,
            stats
        });

    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch machinery"
        });
    }
};

// ==================== GET SINGLE MACHINERY ====================
const getMachineryById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("🔍 Fetching machinery with ID:", id);

        const machinery = await Machinery.findById(id);

        if (!machinery) {
            return res.status(404).json({
                success: false,
                message: "Equipment not found"
            });
        }

        res.status(200).json({
            success: true,
            data: machinery
        });

    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch equipment"
        });
    }
};

// ==================== UPDATE MACHINERY ====================
const updateMachinery = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("✏️ Updating machinery with ID:", id);
        console.log("Update data:", req.body);

        const machinery = await Machinery.findByIdAndUpdate(
            id,
            { ...req.body, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );

        if (!machinery) {
            return res.status(404).json({
                success: false,
                message: "Equipment not found"
            });
        }

        console.log("✅ Machinery updated successfully");

        res.status(200).json({
            success: true,
            message: "Equipment updated successfully",
            data: machinery
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
            message: error.message || "Failed to update equipment"
        });
    }
};

// ==================== UPDATE SERVICE RECORD ====================
const updateServiceRecord = async (req, res) => {
    try {
        const { id } = req.params;
        const { lastService, nextService } = req.body;

        console.log(`🔧 Updating service record for equipment ID: ${id}`);
        console.log("Last Service:", lastService);
        console.log("Next Service:", nextService);

        if (!lastService || !nextService) {
            return res.status(400).json({
                success: false,
                message: "Last service and next service dates are required"
            });
        }

        const machinery = await Machinery.findByIdAndUpdate(
            id,
            {
                lastService,
                nextService,
                status: 'Operational',
                updatedAt: Date.now()
            },
            { new: true, runValidators: true }
        );

        if (!machinery) {
            return res.status(404).json({
                success: false,
                message: "Equipment not found"
            });
        }

        console.log("✅ Service record updated successfully");

        res.status(200).json({
            success: true,
            message: "Service record updated successfully",
            data: machinery
        });

    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to update service record"
        });
    }
};

// ==================== UPDATE STATUS ====================
const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        console.log(`🔄 Updating equipment ${id} status to:`, status);

        const validStatuses = ['Operational', 'Under Maintenance', 'Out of Service'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status. Must be Operational, Under Maintenance, or Out of Service"
            });
        }

        const machinery = await Machinery.findByIdAndUpdate(
            id,
            { status, updatedAt: Date.now() },
            { new: true }
        );

        if (!machinery) {
            return res.status(404).json({
                success: false,
                message: "Equipment not found"
            });
        }

        console.log("✅ Status updated successfully");

        res.status(200).json({
            success: true,
            message: `Status updated to ${status}`,
            data: machinery
        });

    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to update status"
        });
    }
};

// ==================== DELETE MACHINERY ====================
const deleteMachinery = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("🗑️ Deleting machinery with ID:", id);

        const machinery = await Machinery.findByIdAndDelete(id);

        if (!machinery) {
            return res.status(404).json({
                success: false,
                message: "Equipment not found"
            });
        }

        console.log("✅ Machinery deleted successfully:", machinery.equipmentId);

        res.status(200).json({
            success: true,
            message: "Equipment deleted successfully",
            data: machinery
        });

    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to delete equipment"
        });
    }
};

// ==================== GET MACHINERY STATISTICS ====================
const getMachineryStats = async (req, res) => {
    try {
        console.log("📊 Fetching machinery statistics...");

        const total = await Machinery.countDocuments();
        const operational = await Machinery.countDocuments({ status: 'Operational' });
        const maintenance = await Machinery.countDocuments({ status: 'Under Maintenance' });
        const outOfService = await Machinery.countDocuments({ status: 'Out of Service' });

        // Get service overdue count
        const today = new Date().toISOString().split('T')[0];
        const overdue = await Machinery.countDocuments({
            nextService: { $lt: today },
            status: { $ne: 'Out of Service' }
        });

        const stats = {
            total,
            operational,
            maintenance,
            outOfService,
            overdue
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

// ==================== SEARCH MACHINERY ====================
const searchMachinery = async (req, res) => {
    try {
        const { query } = req.query;
        console.log("🔍 Searching machinery with query:", query);

        if (!query) {
            return res.status(400).json({
                success: false,
                message: "Search query is required"
            });
        }

        const machinery = await Machinery.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { model: { $regex: query, $options: 'i' } },
                { equipmentId: { $regex: query, $options: 'i' } },
                { manufacturer: { $regex: query, $options: 'i' } },
                { location: { $regex: query, $options: 'i' } }
            ]
        }).sort({ createdAt: -1 });

        console.log(`✅ Found ${machinery.length} equipment`);

        res.status(200).json({
            success: true,
            count: machinery.length,
            data: machinery
        });

    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to search machinery"
        });
    }
};

module.exports = {
    createMachinery,
    getAllMachinery,
    getMachineryById,
    updateMachinery,
    updateServiceRecord,
    updateStatus,
    deleteMachinery,
    getMachineryStats,
    searchMachinery
};