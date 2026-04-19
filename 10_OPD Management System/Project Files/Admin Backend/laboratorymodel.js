const mongoose = require('mongoose');

const laboratorySchema = new mongoose.Schema({
    testId: {
        type: String,
        required: true,
        unique: true,
        default: function() {
            const date = new Date();
            const year = date.getFullYear().toString().slice(-2);
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
            return `LAB-${year}${month}-${random}`;
        }
    },
    patient: {
        type: String,
        required: [true, "Patient name is required"],
        trim: true
    },
    patientId: {
        type: String,
        default: ''
    },
    test: {
        type: String,
        required: [true, "Test type is required"],
        enum: ['Blood Test', 'Urine Test', 'X-Ray', 'MRI Scan', 'CT Scan', 'Blood Sugar', 'ECG', 'Ultrasound']
    },
    doctor: {
        type: String,
        required: [true, "Doctor name is required"],
        trim: true
    },
    doctorId: {
        type: String,
        default: ''
    },
    date: {
        type: String,
        required: [true, "Test date is required"],
        default: function() {
            return new Date().toISOString().split('T')[0];
        }
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    results: {
        type: String,
        default: null
    },
    technician: {
        type: String,
        default: null
    },
    notes: {
        type: String,
        default: ''
    },
    priority: {
        type: String,
        enum: ['Normal', 'Urgent', 'Emergency'],
        default: 'Normal'
    },
    createdBy: {
        type: String,
        default: 'Receptionist'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    collection: 'laboratory_tests'
});

// Update timestamps on save
laboratorySchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Index for search
laboratorySchema.index({ patient: 'text', test: 'text', testId: 'text', doctor: 'text' });

module.exports = mongoose.model('Laboratory', laboratorySchema);