const mongoose = require('mongoose');

const machinerySchema = new mongoose.Schema({
    equipmentId: {
        type: String,
        required: true,
        unique: true,
        default: function() {
            const date = new Date();
            const year = date.getFullYear().toString().slice(-2);
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
            return `M-${year}${month}-${random}`;
        }
    },
    name: {
        type: String,
        required: [true, "Equipment name is required"],
        trim: true
    },
    model: {
        type: String,
        required: [true, "Model is required"],
        trim: true
    },
    manufacturer: {
        type: String,
        required: [true, "Manufacturer is required"],
        trim: true
    },
    location: {
        type: String,
        required: [true, "Location is required"],
        trim: true
    },
    status: {
        type: String,
        enum: ['Operational', 'Under Maintenance', 'Out of Service'],
        default: 'Operational'
    },
    purchaseDate: {
        type: String,
        required: [true, "Purchase date is required"],
        default: function() {
            return new Date().toISOString().split('T')[0];
        }
    },
    lastService: {
        type: String,
        required: [true, "Last service date is required"],
        default: function() {
            return new Date().toISOString().split('T')[0];
        }
    },
    nextService: {
        type: String,
        required: [true, "Next service date is required"],
        default: function() {
            const date = new Date();
            date.setMonth(date.getMonth() + 1);
            return date.toISOString().split('T')[0];
        }
    },
    cost: {
        type: String,
        default: ''
    },
    warranty: {
        type: String,
        default: ''
    },
    notes: {
        type: String,
        default: ''
    },
    createdBy: {
        type: String,
        default: 'Admin'
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
    collection: 'machinery'
});

// Update timestamps on save
machinerySchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Index for search
machinerySchema.index({ name: 'text', model: 'text', equipmentId: 'text', manufacturer: 'text', location: 'text' });

module.exports = mongoose.model('Machinery', machinerySchema);