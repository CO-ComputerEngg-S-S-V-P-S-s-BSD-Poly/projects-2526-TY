// seed.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const staff = [
  { name: "Admin", email: "admin@college.edu", password: "admin123", role: "admin" },
  { name: "Hod. Nishad Patel", email: "Npatel@college.edu", password: "staff123", role: "teacher", department: "Computer", subject: "OSY, SFT" },
  { name: "Prof. C.P.Bhamare", email: "bhamare@college.edu", password: "staff123", role: "teacher", department: "Computer", subject: "OOP, MAD" },
  { name: "Prof. Ratna Patil", email: "ratna@college.edu", password: "staff123", role: "teacher", department: "Computer", subject: "NIS, ACN" },
  { name: "Prof. Chaitali Patil", email: "chaitali@college.edu", password: "staff123", role: "teacher", department: "Computer", subject: "Java" },
  { name: "Prof. Aishwarya Patil", email: "aishwarya@college.edu", password: "staff123", role: "teacher", department: "Computer", subject: "Linux" },
  { name: "Prof. Niket Sharma", email: "Niket@college.edu", password: "staff123", role: "teacher", department: "Computer", subject: "Python" },
  { name: "Dr. Nivedita Mali", email: "nivedita@college.edu", password: "staff123", role: "teacher", department: "Computer", subject: "CSS" },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/leave-management');
    console.log('✅ MongoDB Connected');

    await User.deleteMany({});
    console.log('🗑️ Old users deleted');

    for (const s of staff) {
      await User.create(s);
    }

    console.log('✅ Staff seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
};

seedDB();