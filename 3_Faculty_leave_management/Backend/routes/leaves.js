// routes/leaves.js
const express = require('express');
const router = express.Router();
const LeaveRequest = require('../models/LeaveRequest');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// @GET /api/leaves
router.get('/', protect, async (req, res) => {
  try {
    let leaves;
    if (req.user.role === 'admin') {
      leaves = await LeaveRequest.find().sort({ createdAt: -1 });
    } else {
      leaves = await LeaveRequest.find({
        $or: [
          { teacherId: req.user._id },
          { 'substituteRequests.freeTeachers.id': String(req.user._id) } // ✅ String match
        ]
      }).sort({ createdAt: -1 });
    }
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @POST /api/leaves
router.post('/', protect, async (req, res) => {
  const { facultyName, department, leaveType, fromDate, toDate, reason, substituteRequests } = req.body;
  try {
    console.log('📩 Leave apply aaya from:', req.user.name);
    console.log('📦 substituteRequests count:', substituteRequests?.length);
    if (substituteRequests?.[0]?.freeTeachers) {
      console.log('👥 freeTeachers sample:', JSON.stringify(substituteRequests[0].freeTeachers));
    }

    const leave = await LeaveRequest.create({
      teacherId: req.user._id,
      teacherName: req.user.name,
      facultyName,
      department,
      leaveType,
      fromDate,
      toDate,
      reason,
      substituteRequests: substituteRequests || [],
    });

    console.log('✅ Leave created:', leave._id);

    // Admin notify
    const admin = await User.findOne({ role: 'admin' });
    if (admin) {
      await Notification.create({
        type: 'leave_applied',
        message: `New leave request from ${req.user.name} (${fromDate} to ${toDate})`,
        toTeacherId: admin._id,
        leaveRequestId: leave._id,
        date: new Date().toISOString().split('T')[0],
      });
      console.log('🔔 Admin ko notification bheja');
    }

    // Free teachers notify
    if (substituteRequests && substituteRequests.length > 0) {
      for (const [index, sub] of substituteRequests.entries()) {
        if (sub.freeTeachers && sub.freeTeachers.length > 0) {
          for (const ft of sub.freeTeachers) {
            console.log('🔍 Teacher dhundh raha hoon:', ft.id, ft.name);

            let teacher = null;

            // ✅ ft.id se dhundo (String ObjectId)
            if (ft.id) {
              teacher = await User.findById(ft.id);
              console.log('ID se mila:', teacher?.name);
            }

            // Fallback — name se dhundo
            if (!teacher && ft.name) {
              teacher = await User.findOne({ name: ft.name });
              console.log('Name se mila:', teacher?.name);
            }

            if (teacher) {
              await Notification.create({
                type: 'substitute_request',
                message: `${req.user.name} is on leave on ${sub.date}. You are free during Period ${sub.period} (${sub.time}). Please cover ${sub.class}.`,
                toTeacherId: teacher._id,
                toTeacherName: teacher.name,
                leaveRequestId: leave._id,
                slotIndex: index,
                date: sub.date,
              });
              console.log(`✅ Notification bheja: ${teacher.name}`);
            } else {
              console.log('❌ Teacher nahi mila for:', ft);
            }
          }
        }
      }
    }

    res.status(201).json(leave);

  } catch (err) {
    console.error('❌ Error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @PUT /api/leaves/:id/status
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  const { status } = req.body;
  try {
    const leave = await LeaveRequest.findByIdAndUpdate(
      req.params.id, { status }, { new: true }
    );

    if (status === 'approved') {
      const days = Math.ceil(
        (new Date(leave.toDate) - new Date(leave.fromDate)) / (1000 * 60 * 60 * 24)
      ) + 1;
      await User.findByIdAndUpdate(leave.teacherId, {
        $inc: { leaveBalance: -days }
      });
    }

    await Notification.create({
      type: status === 'approved' ? 'leave_approved' : 'leave_rejected',
      message: `Your leave request (${leave.fromDate} to ${leave.toDate}) has been ${status}.`,
      toTeacherId: leave.teacherId,
      leaveRequestId: leave._id,
      date: new Date().toISOString().split('T')[0],
    });

    res.json(leave);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @PUT /api/leaves/:id/accept/:slotIndex
router.put('/:id/accept/:slotIndex', protect, async (req, res) => {
  try {
    const leave = await LeaveRequest.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: 'Leave not found' });

    const idx = parseInt(req.params.slotIndex);
    leave.substituteRequests[idx].assignedTeacherId = req.user._id;
    leave.substituteRequests[idx].acceptedByName = req.user.name;
    leave.substituteRequests[idx].subStatus = 'accepted';

    await leave.save();

    await Notification.create({
      type: 'substitute_accepted',
      message: `${req.user.name} accepted to cover your class on ${leave.substituteRequests[idx].date} (Period ${leave.substituteRequests[idx].period}).`,
      toTeacherId: leave.teacherId,
      leaveRequestId: leave._id,
      date: new Date().toISOString().split('T')[0],
    });

    res.json(leave);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;