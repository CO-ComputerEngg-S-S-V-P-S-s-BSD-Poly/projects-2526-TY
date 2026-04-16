const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// ==========================================
// CITIZEN ROUTES (Aam Nagrik ke liye)
// ==========================================

/**
 * @route   POST /api/complaints
 * @desc    Nayi shikayat darj karein (with Image)
 */
router.post('/', auth, upload.single('image'), async (req, res) => {
    try {
        const { category, location, description } = req.body;

        const newComplaint = new Complaint({
            user: req.user.id, // JWT token se milne wali User ID
            category,
            location,
            description,
            image: req.file ? req.file.path : null // Multer se milne wala file path
        });

        const savedComplaint = await newComplaint.save();
        res.status(201).json(savedComplaint);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: Complaint save nahi ho saki.');
    }
});

/**
 * @route   GET /api/complaints/my
 * @desc    Sirf logged-in user ki apni complaints history
 */
router.get('/my', auth, async (req, res) => {
    try {
        // UPDATE: .populate('department', 'name') add kiya taaki user ko dept name dikhe
        const complaints = await Complaint.find({ user: req.user.id })
            .populate('department', 'name') 
            .sort({ createdAt: -1 });
        res.json(complaints);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// ==========================================
// ADMIN ROUTES (Sirf Admin ke liye)
// ==========================================

/**
 * @route   GET /api/complaints/all
 * @desc    Saari complaints dekhna (with User and Department details)
 */
router.get('/all', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ msg: "Access Denied: Admin authorization required" });
        }

        // UPDATE: 'user' ke saath 'department' ko bhi populate kiya
        const allComplaints = await Complaint.find()
            .populate('user', ['name', 'phone', 'email'])
            .populate('department', 'name')
            .sort({ createdAt: -1 });
            
        res.json(allComplaints);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

/**
 * @route   PUT /api/complaints/assign/:id
 * @desc    Complaint ko kisi specific Department ko assign karna
 */
router.put('/assign/:id', auth, async (req, res) => {
    try {
        const { departmentId } = req.body;

        if (req.user.role !== 'admin') {
            return res.status(403).json({ msg: "Not authorized to assign department" });
        }

        let complaint = await Complaint.findById(req.params.id);
        if (!complaint) return res.status(404).json({ msg: "Complaint not found" });

        // Department ID update karein
        complaint.department = departmentId;
        await complaint.save();

        // Updated complaint ko department name ke saath wapas bhejien
        const updatedComplaint = await Complaint.findById(req.params.id).populate('department', 'name');
        res.json({ msg: "Department assigned successfully", complaint: updatedComplaint });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

/**
 * @route   PUT /api/complaints/:id
 * @desc    Complaint ka status update karna (Pending -> Resolved)
 */
router.put('/:id', auth, async (req, res) => {
    try {
        const { status } = req.body;

        if (req.user.role !== 'admin') {
            return res.status(403).json({ msg: "Not authorized to update status" });
        }

        let complaint = await Complaint.findById(req.params.id);
        if (!complaint) return res.status(404).json({ msg: "Complaint not found" });

        complaint.status = status;
        await complaint.save();

        res.json({ msg: "Status updated successfully", complaint });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

/**
 * @route   DELETE /api/complaints/:id
 * @desc    Shikayat delete karna
 */
router.delete('/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ msg: "Unauthorized" });

        await Complaint.findByIdAndDelete(req.params.id);
        res.json({ msg: "Complaint deleted successfully" });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;