const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    patientName: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        default: 'Male'
    },
    dob: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true
    },
    alternatePhone: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        default: ''
    },
    symptoms: [{
        type: String
    }],
    bloodGroup: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-', ''],
        default: ''
    },
    profession: {
        type: String,
        default: ''
    },
    nameOfKin: {
        type: String,
        default: ''
    },
    kinContact: {
        type: String,
        default: ''
    },
    registeredDate: {
        type: String,
        required: true
    },
    registeredTime: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    }
}, {
    timestamps: true
});

// Create indexes for better search performance
patientSchema.index({ patientName: 'text', phone: 'text', email: 'text' });

module.exports = mongoose.model('Patient', patientSchema);