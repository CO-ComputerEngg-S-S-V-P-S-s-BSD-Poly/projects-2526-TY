const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    staffId: {
        type: String,
        required: true,
        unique: true,
        default: function() {
            const prefix = this.role ? this.role.substring(0, 3).toUpperCase() : 'STF';
            const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
            return `${prefix}-${random}`;
        }
    },
    name: {
        type: String,
        required: [true, "Staff name is required"],
        trim: true
    },
    role: {
        type: String,
        required: [true, "Role is required"],
        enum: ['Receptionist', 'Nurse', 'Lab Technician', 'Pharmacist', 'Accountant', 'Cleaner', 'Security', 'Doctor', 'Admin']
    },
    department: {
        type: String,
        default: ''
    },
    shift: {
        type: String,
        required: [true, "Shift is required"],
        enum: ['Morning (8am-4pm)', 'Evening (4pm-12am)', 'Night (12am-8am)', 'General (10am-6pm)']
    },
    status: {
        type: String,
        enum: ['On Duty', 'Off Duty', 'On Leave'],
        default: 'On Duty'
    },
    attendance: {
        type: String,
        default: '100%'
    },
    contact: {
        type: String,
        required: [true, "Contact number is required"],
        validate: {
            validator: function(v) {
                return /^[0-9+\-\s]{10,15}$/.test(v);
            },
            message: "Please enter a valid contact number"
        }
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        validate: {
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: "Please enter a valid email"
        }
    },
    salary: {
        type: String,
        default: ''
    },
    joinDate: {
        type: String,
        required: [true, "Join date is required"]
    },
    image: {
        type: String,
        default: 'https://via.placeholder.com/50'
    },
    createdBy: {
        type: String,
        default: 'Admin'
    },
    createdDate: {
        type: String,
        default: function() {
            return new Date().toISOString().split('T')[0];
        }
    }
}, {
    timestamps: true,
    collection: 'staff'
});

// Compound index for search optimization
staffSchema.index({ name: 'text', role: 'text', department: 'text', email: 'text' });

module.exports = mongoose.model('Staff', staffSchema);