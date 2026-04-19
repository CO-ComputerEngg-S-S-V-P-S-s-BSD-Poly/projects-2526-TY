// models/patientmodel.js
const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  // Personal Information
  patientName: {
    type: String,
    required: [true, 'Patient name is required'],
    trim: true
  },
  
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: 1,
    max: 150
  },
  
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: ['Male', 'Female', 'Other']
  },
  
  dob: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  
  bloodGroup: {
    type: String,
    required: [true, 'Blood group is required'],
    enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']
  },

  // Contact Information
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    match: [/^[0-9]{10}$/, 'Phone must be 10 digits']
  },
  
  alternatePhone: String,
  address: String,

  // Medical Information
  symptoms: String,
  profession: String,

  // Emergency Contact
  nameOfKin: String,
  kinContact: String,

  // Registration Information
  registeredDate: String,
  registeredTime: String,
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Discharged'],
    default: 'Active'
  },

  // Admin specific fields
  disease: String,
  doctor: String,
  admitted: String,
  bed: String,
  admissionType: {
    type: String,
    enum: ['Regular', 'Emergency', 'OPD'],
    default: 'Regular'
  },
  dischargedDate: String,
  emergencyContact: String
}, {
  timestamps: true
});

// Index for search
patientSchema.index({ 
  patientName: 'text', 
  email: 'text', 
  phone: 'text' 
});

module.exports = mongoose.model('Patient', patientSchema);