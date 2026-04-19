// // // const express = require("express");
// // // const mongoose = require("mongoose");
// // // const cors = require('cors');
// // // const connectDB = require('./db');

// // // const app = express();

// // // // ✅ ULTIMATE CORS FIX - Allow everything
// // // app.use(express.json());
// // // app.use(express.urlencoded({ extended: true }));

// // // // Method 1: Using cors package with all options
// // // app.use(cors({
// // //     origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003'],
// // //     credentials: true,
// // //     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
// // //     allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
// // //     optionsSuccessStatus: 200
// // // }));

// // // // Method 2: Manual headers (backup)
// // // app.use((req, res, next) => {
// // //     res.header('Access-Control-Allow-Origin', req.headers.origin || 'http://localhost:3002');
// // //     res.header('Access-Control-Allow-Credentials', 'true');
// // //     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
// // //     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
    
// // //     // Handle preflight
// // //     if (req.method === 'OPTIONS') {
// // //         return res.sendStatus(200);
// // //     }
// // //     next();
// // // });

// // // // Connect to MongoDB
// // // connectDB();

// // // // ==================== IMPORT ROUTES ====================
// // // const laboratoryroute = require('./laboratoryroute');
// // // const staffRoutes = require('./staffroute');
// // // const authRoutes = require('./authroute');
// // // const machineryRoute = require('./machineryroute');
// // // const patientRoutes = require('./patientroute');
// // // const bedRoutes = require('./bedroute');

// // // // ==================== USE ROUTES ====================
// // // app.use('/api', laboratoryroute);
// // // app.use('/api', staffRoutes);
// // // app.use('/api', authRoutes);
// // // app.use('/api', machineryRoute);
// // // app.use('/api/patients', patientRoutes);
// // // app.use('/api', bedRoutes);

// // // // Test route
// // // app.get('/test', (req, res) => {
// // //     res.json({ 
// // //         success: true,
// // //         message: '✅ Server is running on port 8005',
// // //         mongodb: mongoose.connection.readyState === 1 ? '✅ Connected' : '❌ Disconnected',
// // //         cors: {
// // //             allowedOrigins: ['3000', '3001', '3002', '3003']
// // //         }
// // //     });
// // // });

// // // const PORT = 8005;

// // // app.listen(PORT, () => {
// // //     console.log(`\n🚀 Server running on http://localhost:${PORT}`);
// // //     console.log(`🧪 Test: http://localhost:${PORT}/test`);
// // //     console.log("\n📋 CORS Allowed Origins:");
// // //     console.log("   ✅ http://localhost:3000");
// // //     console.log("   ✅ http://localhost:3001");
// // //     console.log("   ✅ http://localhost:3002");
// // //     console.log("   ✅ http://localhost:3003\n");
// // // });

// // const express = require("express");
// // const mongoose = require("mongoose");
// // const cors = require('cors');
// // const connectDB = require('./db');

// // const app = express();

// // // ✅ ULTIMATE CORS FIX - Allow everything
// // app.use(express.json());
// // app.use(express.urlencoded({ extended: true }));

// // // Method 1: Using cors package with all options
// // app.use(cors({
// //     origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3006', 'http://localhost:3003'], // ✅ 3002 → 3006
// //     credentials: true,
// //     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
// //     allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
// //     optionsSuccessStatus: 200
// // }));

// // // Method 2: Manual headers (backup)
// // app.use((req, res, next) => {
// //     res.header('Access-Control-Allow-Origin', req.headers.origin || 'http://localhost:3006'); // ✅ 3002 → 3006
// //     res.header('Access-Control-Allow-Credentials', 'true');
// //     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
// //     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
    
// //     // Handle preflight
// //     if (req.method === 'OPTIONS') {
// //         return res.sendStatus(200);
// //     }
// //     next();
// // });

// // // Connect to MongoDB
// // connectDB();

// // // ==================== IMPORT ROUTES ====================
// // const laboratoryroute = require('./laboratoryroute');
// // const staffRoutes = require('./staffroute');
// // const authRoutes = require('./authroute');
// // const machineryRoute = require('./machineryroute');
// // const patientRoutes = require('./patientroute');
// // const bedRoutes = require('./bedroute');

// // // ==================== USE ROUTES ====================
// // app.use('/api', laboratoryroute);
// // app.use('/api', staffRoutes);
// // app.use('/api', authRoutes);
// // app.use('/api', machineryRoute);
// // app.use('/api/patients', patientRoutes);
// // app.use('/api', bedRoutes);

// // // Test route
// // app.get('/test', (req, res) => {
// //     res.json({ 
// //         success: true,
// //         message: '✅ Server is running on port 8005',
// //         mongodb: mongoose.connection.readyState === 1 ? '✅ Connected' : '❌ Disconnected',
// //         cors: {
// //             allowedOrigins: ['3000', '3001', '3006', '3003'] // ✅ 3002 → 3006
// //         }
// //     });
// // });

// // const PORT = 8005;

// // app.listen(PORT, () => {
// //     console.log(`\n🚀 Server running on http://localhost:${PORT}`);
// //     console.log(`🧪 Test: http://localhost:${PORT}/test`);
// //     console.log("\n📋 CORS Allowed Origins:");
// //     console.log("   ✅ http://localhost:3000");
// //     console.log("   ✅ http://localhost:3001");
// //     console.log("   ✅ http://localhost:3006"); // ✅ 3002 → 3006
// //     console.log("   ✅ http://localhost:3003\n");
// // });


// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require('cors');
// const connectDB = require('./db');

// const app = express();

// // ✅ ULTIMATE CORS FIX - Allow everything
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Method 1: Using cors package with all options
// app.use(cors({
//     origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3006', 'http://localhost:3003'],
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
//     optionsSuccessStatus: 200
// }));

// // Method 2: Manual headers (backup)
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', req.headers.origin || 'http://localhost:3006');
//     res.header('Access-Control-Allow-Credentials', 'true');
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
    
//     // Handle preflight
//     if (req.method === 'OPTIONS') {
//         return res.sendStatus(200);
//     }
//     next();
// });

// // Connect to MongoDB
// connectDB();

// // ==================== IMPORT ROUTES ====================
// const laboratoryroute = require('./laboratoryroute');
// const staffRoutes = require('./staffroute');
// const authRoutes = require('./authroute');
// const machineryRoute = require('./machineryroute');
// const patientRoutes = require('./patientroute');
// const bedRoutes = require('./bedroute');
// const Doctorroutes = require('./Doctorroutes'); // ✅ DOCTORS ROUTE ADDED

// // ==================== USE ROUTES ====================
// app.use('/api', laboratoryroute);
// app.use('/api', staffRoutes);
// app.use('/api', authRoutes);
// app.use('/api', machineryRoute);
// app.use('/api/patients', patientRoutes);
// app.use('/api', bedRoutes);
// app.use('/api/doctors', Doctorroutes); // ✅ DOCTORS ROUTE ADDED

// // Debugging middleware - sab routes check karo
// app.use((req, res, next) => {
//     console.log(`📥 ${req.method} ${req.url}`);
//     next();
// });

// // Test route
// app.get('/test', (req, res) => {
//     res.json({ 
//         success: true,
//         message: '✅ Server is running on port 8005',
//         mongodb: mongoose.connection.readyState === 1 ? '✅ Connected' : '❌ Disconnected',
//         cors: {
//             allowedOrigins: ['3000', '3001', '3006', '3003']
//         },
//         routes: {
//             doctors: '/api/doctors',
//             beds: '/api/beds',
//             staff: '/api/staff',
//             patients: '/api/patients',
//             laboratory: '/api/laboratory',
//             machinery: '/api/machinery',
//             auth: '/api/auth'
//         }
//     });
// });

// // Test doctors route
// app.get('/api/test-doctors', (req, res) => {
//     res.json({ 
//         success: true,
//         message: 'Doctors route is working!',
//         availableRoutes: [
//             'GET /api/doctors - Get all doctors',
//             'GET /api/doctors/:id - Get single doctor',
//             'POST /api/doctors - Create new doctor',
//             'PUT /api/doctors/:id - Update doctor',
//             'DELETE /api/doctors/:id - Delete doctor'
//         ]
//     });
// });

// const PORT = 8005;

// app.listen(PORT, () => {
//     console.log(`\n🚀 Server running on http://localhost:${PORT}`);
//     console.log(`🧪 Test: http://localhost:${PORT}/test`);
//     console.log(`👨‍⚕️ Doctors API: http://localhost:${PORT}/api/doctors`);
//     console.log(`🔍 Test Doctors: http://localhost:${PORT}/api/test-doctors`);
//     console.log("\n📋 CORS Allowed Origins:");
//     console.log("   ✅ http://localhost:3000");
//     console.log("   ✅ http://localhost:3001");
//     console.log("   ✅ http://localhost:3006");
//     console.log("   ✅ http://localhost:3003\n");
// });


const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const connectDB = require('./db');

const app = express();

// ✅ ULTIMATE CORS FIX - Allow everything
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Method 1: Using cors package with all options
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3006', 'http://localhost:3003'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    optionsSuccessStatus: 200
}));

// Method 2: Manual headers (backup)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin || 'http://localhost:3006');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
    
    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Connect to MongoDB
connectDB();

// ==================== IMPORT ROUTES ====================
const laboratoryroute = require('./laboratoryroute');
const staffRoutes = require('./staffroute');
const authRoutes = require('./authroute');
const machineryRoute = require('./machineryroute');
const patientRoutes = require('./patientroute');
const bedRoutes = require('./bedroute');
const doctorRoutes = require('./Doctorroutes'); // ✅ DOCTOR ROUTES - Capital D

// ==================== USE ROUTES ====================
app.use('/api', laboratoryroute);
app.use('/api', staffRoutes);
app.use('/api', authRoutes);
app.use('/api', machineryRoute);
app.use('/api/patients', patientRoutes);
app.use('/api', bedRoutes);
app.use('/api/doctors', doctorRoutes); // ✅ DOCTORS ROUTE - /api/doctors

// Debugging middleware - sab routes check karo
app.use((req, res, next) => {
    console.log(`📥 ${req.method} ${req.url}`);
    next();
});

// Test route
app.get('/test', (req, res) => {
    res.json({ 
        success: true,
        message: '✅ Server is running on port 8005',
        mongodb: mongoose.connection.readyState === 1 ? '✅ Connected' : '❌ Disconnected',
        cors: {
            allowedOrigins: ['3000', '3001', '3006', '3003']
        },
        routes: {
            doctors: '/api/doctors',
            beds: '/api/beds',
            staff: '/api/staff',
            patients: '/api/patients',
            laboratory: '/api/laboratory',
            machinery: '/api/machinery',
            auth: '/api/auth'
        }
    });
});

// Test doctors route
app.get('/api/test-doctors', (req, res) => {
    res.json({ 
        success: true,
        message: 'Doctors route is working!',
        availableRoutes: [
            'GET /api/doctors - Get all doctors',
            'GET /api/doctors/:id - Get single doctor',
            'POST /api/doctors - Create new doctor',
            'PUT /api/doctors/:id - Update doctor',
            'DELETE /api/doctors/:id - Delete doctor'
        ]
    });
});

// ✅ TEMPORARY ROUTE - Sample doctors add karne ke liye
app.post('/api/seed-doctors', async (req, res) => {
    try {
        const Doctor = require('./models/DoctorModel');
        
        // Pehle check karo ki doctors already hain ya nahi
        const count = await Doctor.countDocuments();
        if (count > 0) {
            return res.json({
                success: true,
                message: `Doctors already exist: ${count} doctors`,
                count
            });
        }
        
        const sampleDoctors = [
            {
                name: 'Dr. Pranjal Patil',
                email: 'pranjal.patil@hospital.com',
                phone: '9876543210',
                specialization: 'Cardiologist',
                qualification: 'MD, DM Cardiology',
                experience: 10,
                licenseNumber: 'LIC001',
                department: 'Cardiology',
                consultationFee: 1000,
                availableDays: ['Monday', 'Wednesday', 'Friday'],
                availableTime: { start: '09:00', end: '17:00' },
                bio: 'Senior Cardiologist with 10+ years experience',
                isActive: true
            },
            {
                name: 'Dr. Rajesh Sharma',
                email: 'rajesh.sharma@hospital.com',
                phone: '9876543211',
                specialization: 'Neurologist',
                qualification: 'MD, DM Neurology',
                experience: 8,
                licenseNumber: 'LIC002',
                department: 'Neurology',
                consultationFee: 1200,
                availableDays: ['Tuesday', 'Thursday', 'Saturday'],
                availableTime: { start: '10:00', end: '18:00' },
                bio: 'Expert in neurological disorders',
                isActive: true
            },
            {
                name: 'Dr. Priya Singh',
                email: 'priya.singh@hospital.com',
                phone: '9876543212',
                specialization: 'Pediatrician',
                qualification: 'MD Pediatrics',
                experience: 6,
                licenseNumber: 'LIC003',
                department: 'Pediatrics',
                consultationFee: 800,
                availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
                availableTime: { start: '09:00', end: '17:00' },
                bio: 'Child specialist with gentle approach',
                isActive: true
            }
        ];
        
        await Doctor.insertMany(sampleDoctors);
        res.json({
            success: true,
            message: 'Sample doctors added successfully',
            count: sampleDoctors.length,
            doctors: sampleDoctors
        });
    } catch (error) {
        console.error('Error seeding doctors:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// 404 handler - agar koi route na mile to
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
        availableRoutes: [
            '/test',
            '/api/test-doctors',
            '/api/doctors',
            '/api/beds',
            '/api/staff',
            '/api/patients',
            '/api/laboratory',
            '/api/machinery',
            '/api/auth'
        ]
    });
});

const PORT = 8005;

app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`🧪 Test: http://localhost:${PORT}/test`);
    console.log(`👨‍⚕️ Doctors API: http://localhost:${PORT}/api/doctors`);
    console.log(`🔍 Test Doctors: http://localhost:${PORT}/api/test-doctors`);
    console.log(`🌱 Seed Doctors: POST http://localhost:${PORT}/api/seed-doctors`);
    console.log("\n📋 CORS Allowed Origins:");
    console.log("   ✅ http://localhost:3000");
    console.log("   ✅ http://localhost:3001");
    console.log("   ✅ http://localhost:3006");
    console.log("   ✅ http://localhost:3003\n");
});