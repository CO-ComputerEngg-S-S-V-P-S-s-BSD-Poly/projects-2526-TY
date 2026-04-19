const mongoose = require('mongoose');

const bedSchema = new mongoose.Schema({
    bedNumber: {
        type: String,
        required: [true, "Bed number is required"],
        unique: true,
        trim: true
    },
    
    status: {
        type: String,
        required: [true, "Status is required"],
        enum: ['Available', 'Occupied', 'Maintenance', 'Reserved'],
        default: 'Available'
    }
}, {
    timestamps: true,
    collection: 'beds'
});

// Index for search
bedSchema.index({ bedNumber: 'text', status: 'text' });

module.exports = mongoose.model('Bed', bedSchema);