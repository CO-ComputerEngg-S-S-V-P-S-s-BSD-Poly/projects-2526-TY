const AppointmentModel = require('./Appointmentmodel');

// ==================== CREATE APPOINTMENT ====================
const createAppointment = async (req, res) => {
    try {
        console.log("=".repeat(60));
        console.log("📅 APPOINTMENT BOOKING REQUEST RECEIVED");
        console.log("=".repeat(60));
        console.log("Request Body:", JSON.stringify(req.body, null, 2));
        console.log("-".repeat(60));

        const {
            patientName, age, gender, phone, email, symptoms,
            date, time, status, type, doctor, notes,
            bookingDate, bookingTime
        } = req.body;

        // Validate required fields
        const missingFields = [];
        if (!patientName) missingFields.push('patientName');
        if (!age) missingFields.push('age');
        if (!gender) missingFields.push('gender');
        if (!phone) missingFields.push('phone');
        if (!email) missingFields.push('email');
        if (!date) missingFields.push('date');
        if (!time) missingFields.push('time');

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing",
                missingFields
            });
        }

        // ✅ Check for duplicate (date+time) - just to give better message, but DB index will also catch
        const existingAppointment = await AppointmentModel.findOne({
            date: date,
            time: time,
            status: { $ne: 'Cancelled' }
        });

        if (existingAppointment) {
            return res.status(409).json({
                success: false,
                message: "This time slot is already booked. Please choose another time."
            });
        }

        // Generate appointment ID
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        const appointmentId = `APT-${year}${month}${day}-${random}`;

        const newAppointment = new AppointmentModel({
            appointmentId,
            patientName: patientName.trim(),
            age: parseInt(age),
            gender,
            phone,
            email,
            symptoms: symptoms || '',
            date,
            time,
            status: status || 'Pending',
            type: type || 'Cardiology',
            doctor: doctor || 'Dr. Pranjal Patil',
            notes: notes || '',
            bookingDate: bookingDate || new Date().toISOString().split('T')[0],
            bookingTime: bookingTime || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
        });

        const savedAppointment = await newAppointment.save();

        // 🔔 Broadcast update to all connected clients
        if (req.io) {
            req.io.emit('appointment-updated', {
                action: 'create',
                appointment: savedAppointment
            });
        }

        console.log("✅ APPOINTMENT BOOKED SUCCESSFULLY! ID:", savedAppointment.appointmentId);

        res.status(201).json({
            success: true,
            message: "Appointment booked successfully",
            appointment: savedAppointment
        });

    } catch (error) {
        console.error("❌ ERROR:", error);

        // Handle duplicate key error from MongoDB index
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "This time slot is already booked! (Database unique constraint)"
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
            message: error.message || "Failed to book appointment"
        });
    }
};

// ==================== GET ALL APPOINTMENTS ====================
const getAllAppointments = async (req, res) => {
    try {
        console.log("📥 Fetching all appointments");
        const appointments = await AppointmentModel.find().sort({ createdAt: -1 });

        const stats = {
            total: appointments.length,
            pending: appointments.filter(a => a.status === 'Pending').length,
            confirmed: appointments.filter(a => a.status === 'Confirmed').length,
            completed: appointments.filter(a => a.status === 'Completed').length,
            cancelled: appointments.filter(a => a.status === 'Cancelled').length
        };

        res.status(200).json({
            success: true,
            count: appointments.length,
            appointments,
            stats
        });
    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch appointments"
        });
    }
};

// ==================== GET TODAY'S APPOINTMENTS ====================
const getTodaysAppointments = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const appointments = await AppointmentModel.find({
            date: today,
            status: { $ne: 'Cancelled' }
        }).sort({ time: 1 });

        res.status(200).json({
            success: true,
            date: today,
            count: appointments.length,
            appointments
        });
    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch today's appointments"
        });
    }
};

// ==================== GET APPOINTMENT STATISTICS ====================
const getAppointmentStats = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];

        const [
            total,
            today_count,
            pending,
            confirmed,
            completed,
            cancelled
        ] = await Promise.all([
            AppointmentModel.countDocuments(),
            AppointmentModel.countDocuments({ date: today }),
            AppointmentModel.countDocuments({ status: 'Pending' }),
            AppointmentModel.countDocuments({ status: 'Confirmed' }),
            AppointmentModel.countDocuments({ status: 'Completed' }),
            AppointmentModel.countDocuments({ status: 'Cancelled' })
        ]);

        const stats = { total, today: today_count, pending, confirmed, completed, cancelled };

        res.status(200).json({ success: true, stats });
    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch statistics" });
    }
};

// ==================== UPDATE APPOINTMENT ====================
const updateAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("✏️ Updating appointment:", id);

        // If date/time changed, check for conflict (excluding current)
        if (req.body.date && req.body.time) {
            const existing = await AppointmentModel.findOne({
                date: req.body.date,
                time: req.body.time,
                status: { $ne: 'Cancelled' },
                _id: { $ne: id }
            });
            if (existing) {
                return res.status(409).json({
                    success: false,
                    message: "This time slot is already booked. Please choose another time."
                });
            }
        }

        const updatedAppointment = await AppointmentModel.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedAppointment) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        // 🔔 Broadcast update
        if (req.io) {
            req.io.emit('appointment-updated', {
                action: 'update',
                appointment: updatedAppointment
            });
        }

        // Recalculate stats
        const appointments = await AppointmentModel.find();
        const stats = {
            total: appointments.length,
            pending: appointments.filter(a => a.status === 'Pending').length,
            confirmed: appointments.filter(a => a.status === 'Confirmed').length,
            completed: appointments.filter(a => a.status === 'Completed').length,
            cancelled: appointments.filter(a => a.status === 'Cancelled').length
        };

        res.status(200).json({
            success: true,
            message: "Appointment updated successfully",
            appointment: updatedAppointment,
            stats
        });
    } catch (error) {
        console.error("❌ Error:", error);
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: "This time slot is already booked!" });
        }
        res.status(500).json({ success: false, message: error.message || "Failed to update appointment" });
    }
};

// ==================== UPDATE APPOINTMENT STATUS ====================
const updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status" });
        }

        const appointment = await AppointmentModel.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        // 🔔 Broadcast update
        if (req.io) {
            req.io.emit('appointment-updated', {
                action: 'status-update',
                appointment
            });
        }

        const appointments = await AppointmentModel.find();
        const stats = {
            total: appointments.length,
            pending: appointments.filter(a => a.status === 'Pending').length,
            confirmed: appointments.filter(a => a.status === 'Confirmed').length,
            completed: appointments.filter(a => a.status === 'Completed').length,
            cancelled: appointments.filter(a => a.status === 'Cancelled').length
        };

        res.status(200).json({
            success: true,
            message: `Status updated to ${status}`,
            appointment,
            stats
        });
    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ success: false, message: "Failed to update status" });
    }
};

// ==================== DELETE APPOINTMENT ====================
const deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const appointment = await AppointmentModel.findByIdAndDelete(id);

        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        // 🔔 Broadcast delete
        if (req.io) {
            req.io.emit('appointment-updated', {
                action: 'delete',
                id
            });
        }

        const appointments = await AppointmentModel.find();
        const stats = {
            total: appointments.length,
            pending: appointments.filter(a => a.status === 'Pending').length,
            confirmed: appointments.filter(a => a.status === 'Confirmed').length,
            completed: appointments.filter(a => a.status === 'Completed').length,
            cancelled: appointments.filter(a => a.status === 'Cancelled').length
        };

        res.status(200).json({
            success: true,
            message: "Appointment deleted successfully",
            stats
        });
    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ success: false, message: "Failed to delete appointment" });
    }
};

// ==================== GET SINGLE APPOINTMENT ====================
const getAppointmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const appointment = await AppointmentModel.findById(id);
        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }
        res.status(200).json({ success: true, appointment });
    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch appointment" });
    }
};

module.exports = {
    createAppointment,
    getAllAppointments,
    getTodaysAppointments,
    getAppointmentStats,
    updateAppointment,
    updateAppointmentStatus,
    deleteAppointment,
    getAppointmentById
};