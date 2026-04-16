const Bed = require('./bedmodel');

// ==================== CREATE ====================
exports.createBed = async (req, res) => {
    try {
        const existingBed = await Bed.findOne({ bedNumber: req.body.bedNumber });
        if (existingBed) {
            return res.status(400).json({ 
                success: false, 
                message: 'Bed number already exists' 
            });
        }

        const bed = new Bed(req.body);
        await bed.save();
        
        res.status(201).json({
            success: true,
            message: 'Bed created successfully',
            data: bed
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ==================== READ ====================
exports.getAllBeds = async (req, res) => {
    try {
        const { status, type, ward } = req.query;
        let query = {};

        if (status) query.status = status;
        if (type) query.type = type;
        if (ward) query.ward = { $regex: ward, $options: 'i' };

        const beds = await Bed.find(query).sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: beds.length,
            data: beds
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getBedStats = async (req, res) => {
    try {
        const total = await Bed.countDocuments();
        const available = await Bed.countDocuments({ status: 'Available' });
        const occupied = await Bed.countDocuments({ status: 'Occupied' });
        const maintenance = await Bed.countDocuments({ status: 'Maintenance' });
        const reserved = await Bed.countDocuments({ status: 'Reserved' });
        
        const typeDistribution = await Bed.aggregate([
            { $group: { _id: '$type', count: { $sum: 1 } } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                total,
                available,
                occupied,
                maintenance,
                reserved,
                typeDistribution,
                occupancyRate: total > 0 ? ((occupied / total) * 100).toFixed(2) : 0
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.searchBeds = async (req, res) => {
    try {
        const { q } = req.query;
        
        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        const beds = await Bed.find({
            $or: [
                { bedNumber: { $regex: q, $options: 'i' } },
                { ward: { $regex: q, $options: 'i' } },
                { type: { $regex: q, $options: 'i' } },
                { building: { $regex: q, $options: 'i' } }
            ]
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: beds.length,
            data: beds
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getBedById = async (req, res) => {
    try {
        const bed = await Bed.findById(req.params.id);
        
        if (!bed) {
            return res.status(404).json({
                success: false,
                message: 'Bed not found'
            });
        }

        res.status(200).json({
            success: true,
            data: bed
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==================== UPDATE ====================
exports.updateBed = async (req, res) => {
    try {
        if (req.body.bedNumber) {
            const existingBed = await Bed.findOne({ 
                bedNumber: req.body.bedNumber,
                _id: { $ne: req.params.id }
            });
            
            if (existingBed) {
                return res.status(400).json({
                    success: false,
                    message: 'Bed number already exists'
                });
            }
        }

        const bed = await Bed.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!bed) {
            return res.status(404).json({
                success: false,
                message: 'Bed not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Bed updated successfully',
            data: bed
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

exports.updateBedStatus = async (req, res) => {
    try {
        const { status } = req.body;
        
        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'Status is required'
            });
        }

        const bed = await Bed.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!bed) {
            return res.status(404).json({
                success: false,
                message: 'Bed not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Bed status updated successfully',
            data: bed
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ==================== DELETE ====================
exports.deleteBed = async (req, res) => {
    try {
        const bed = await Bed.findByIdAndDelete(req.params.id);

        if (!bed) {
            return res.status(404).json({
                success: false,
                message: 'Bed not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Bed deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};