// const mongoose = require('mongoose');

// const doctorSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true
//     },
//     specialization: {
//         type: String,
//         required: true
//     },
//     department: {
//         type: String,
//         required: true
//     },
//     phone: {
//         type: String,
//         required: true
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     address: {
//         type: String,
//         required: true
//     },
//     experience: {
//         type: String,
//         required: true
//     },
//     licenseNumber: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     qualifications: {
//         type: String,
//         required: true
//     },
//     joinDate: {
//         type: Date,
//         required: true
//     },
//     profilePhoto: {
//         type: String,
//         default: null
//     }
// }, {
//     timestamps: true,
//     collection: 'doctors'
// });

// module.exports = mongoose.model('Doctor', doctorSchema);


const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    specialization: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true
    },
    experience: {
        type: String,
        required: true
    },
    licenseNumber: {
        type: String,
        required: true,
        unique: true
    },
    qualifications: {
        type: String,
        required: true
    },
    joinDate: {
        type: Date,
        required: true
    },
    profilePhoto: {
        type: String,
        default: null
    }
}, {
    timestamps: true,
    collection: 'doctors'
});

module.exports = mongoose.model('Doctor', doctorSchema);