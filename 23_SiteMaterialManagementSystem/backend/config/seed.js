const bcrypt = require('bcryptjs');
const User = require('../models/User');

const seedUsers = async () => {
  try {
    // ── Admin ──────────────────────────────────────────────────────────────────
    const adminExists = await User.findOne({ email: 'admin@padmashree.com' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      await User.create({
        name: 'Admin',
        email: 'admin@padmashree.com',
        username: 'admin',
        password: hashedPassword,
        role: 'admin',
      });
      console.log('✅ Admin created: admin@padmashree.com / Admin@123');
    }

    // ── Supervisors ────────────────────────────────────────────────────────────
    const supervisors = [
      { name: 'Nilesh Wadile',    email: 'nilesh@padmashree.com',    username: 'nilesh_wadile',    password: 'Nilesh@123',    site: 'Shivashree 12' },
      { name: 'Dhanashree Wagh',  email: 'dhanashree@padmashree.com',username: 'dhanashree_wagh',  password: 'Dhanashree@123',site: 'Shivashree 7D' },
      { name: 'Vijay Bagul',      email: 'vijay@padmashree.com',     username: 'vijay_bagul',      password: 'Vijay@123',     site: 'Shivashree 9D' },
      { name: 'Piyush Ahire',     email: 'piyush@padmashree.com',    username: 'piyush_ahire',     password: 'Piyush@123',    site: 'Shivashree 12A' },
      { name: 'Vijay Bagul',      email: 'vijay2@padmashree.com',    username: 'vijay_bagul_p8',   password: 'Vijay@123',     site: 'Padmashree 8' },
      { name: 'Jayesh Bhavsar',   email: 'jayesh@padmashree.com',    username: 'jayesh_bhavsar',   password: 'Jayesh@123',    site: 'Padmashree Park Nashik' },
      { name: 'Piyush Ahire',     email: 'piyush2@padmashree.com',   username: 'piyush_ahire_p9',  password: 'Piyush@123',    site: 'Padmashree 9' },
      { name: 'Deepraj Dhivre',   email: 'deepraj@padmashree.com',   username: 'deepraj_dhivre',   password: 'Deepraj@123',   site: 'Ekdant Padmashree Heights' },
    ];

    for (const sup of supervisors) {
      const exists = await User.findOne({ email: sup.email });
      if (!exists) {
        const hashedPassword = await bcrypt.hash(sup.password, 10);
        await User.create({
          name: sup.name,
          email: sup.email,
          username: sup.username,
          password: hashedPassword,
          role: 'supervisor',
          site: sup.site,
          isApproved: true,
        });
        console.log(`✅ Supervisor: ${sup.name} → ${sup.site}`);
      }
    }
  } catch (error) {
    console.error('❌ Seed Error:', error.message);
  }
};

module.exports = seedUsers;
