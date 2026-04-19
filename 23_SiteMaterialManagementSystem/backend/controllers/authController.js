const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendCredentialsEmail } = require('../config/mailer');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// ─── Generate unique username from name ───────────────────────────────────────
const generateUsername = (name) => {
  const base = name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
  const suffix = Math.floor(1000 + Math.random() * 9000); // 4-digit random
  return `${base}_${suffix}`;
};

// ─── Generate random secure password ─────────────────────────────────────────
const generatePassword = () => {
  const upper  = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower  = 'abcdefghjkmnpqrstuvwxyz';
  const digits = '23456789';
  const specials = '@#$!';
  const all = upper + lower + digits + specials;

  let pwd = '';
  pwd += upper[Math.floor(Math.random() * upper.length)];
  pwd += lower[Math.floor(Math.random() * lower.length)];
  pwd += digits[Math.floor(Math.random() * digits.length)];
  pwd += specials[Math.floor(Math.random() * specials.length)];
  for (let i = 4; i < 10; i++) {
    pwd += all[Math.floor(Math.random() * all.length)];
  }
  // Shuffle
  return pwd.split('').sort(() => Math.random() - 0.5).join('');
};

// ─── Step 1: Pre-register ─────────────────────────────────────────────────────
// Supervisor submits name + real email + any password
// System generates unique username+password → sends email → saves pending user
// POST /api/register
const registerUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    const submittedPassword = req.body.password;

    if (!name || !email || !submittedPassword) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    // Check email not already used
    if (await User.findOne({ email: email.toLowerCase().trim() })) {
      return res.status(400).json({ message: 'This email is already registered' });
    }

    // Generate unique system credentials
    let systemUsername = generateUsername(name);
    // Ensure username is unique
    while (await User.findOne({ username: systemUsername })) {
      systemUsername = generateUsername(name);
    }
    const systemPassword = generatePassword();

    // Hash the system password for storage
    const hashedPassword = await bcrypt.hash(systemPassword, 10);

    // Save user with system credentials (not submitted password)
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      username: systemUsername,
      password: hashedPassword,
      role: 'supervisor',
      site: null,
      isApproved: true,
    });

    // Send email with credentials
    await sendCredentialsEmail({
      toEmail: email,
      supervisorName: name.trim(),
      loginUsername: systemUsername,
      loginPassword: systemPassword,
    });

    return res.status(201).json({
      message: 'Account created! Check your email for login credentials.',
    });
  } catch (error) {
    console.error('REGISTER ERROR:', error.message);
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ message: `${field === 'email' ? 'Email' : 'Username'} already in use` });
    }
    return res.status(500).json({ message: error.message });
  }
};

// ─── Step 2: Login with system credentials ────────────────────────────────────
// POST /api/login
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Please provide username and password' });
    }

    // Login ONLY by username (system-generated)
    const user = await User.findOne({ username: username.trim() });
    if (!user) return res.status(401).json({ message: 'Invalid username or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid username or password' });

    return res.status(200).json({
      message: 'Login successful',
      user: { _id: user._id, name: user.name, email: user.email, username: user.username, role: user.role, site: user.site },
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('LOGIN ERROR:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

// ─── Admin Login (by email + password) ───────────────────────────────────────
// POST /api/admin-login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user || user.role !== 'admin') {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    return res.status(200).json({
      message: 'Login successful',
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, site: null },
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('ADMIN LOGIN ERROR:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

// ─── Select Site ──────────────────────────────────────────────────────────────
const selectSite = async (req, res) => {
  try {
    const { site } = req.body;
    if (!site) return res.status(400).json({ message: 'Please select a site' });

    const user = await User.findByIdAndUpdate(req.user._id, { site }, { new: true }).select('-password');
    return res.status(200).json({
      message: 'Site selected successfully',
      user: { _id: user._id, name: user.name, email: user.email, username: user.username, role: user.role, site: user.site },
    });
  } catch (error) {
    console.error('SELECT SITE ERROR:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

// ─── Get Profile ──────────────────────────────────────────────────────────────
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ─── Admin: Get All Supervisors ───────────────────────────────────────────────
const getSupervisors = async (req, res) => {
  try {
    const supervisors = await User.find({ role: 'supervisor' }).select('-password');
    return res.status(200).json(supervisors);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ─── Admin: Create Supervisor ─────────────────────────────────────────────────
const createSupervisor = async (req, res) => {
  try {
    const { name, email, site } = req.body;
    if (!name || !email) return res.status(400).json({ message: 'Name and email are required' });
    if (await User.findOne({ email: email.toLowerCase().trim() })) return res.status(400).json({ message: 'Email already in use' });

    // Generate system credentials
    let systemUsername = generateUsername(name);
    while (await User.findOne({ username: systemUsername })) {
      systemUsername = generateUsername(name);
    }
    const systemPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(systemPassword, 10);

    const supervisor = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      username: systemUsername,
      password: hashedPassword,
      role: 'supervisor',
      site: site || null,
      isApproved: true,
    });

    // Send credentials email
    await sendCredentialsEmail({
      toEmail: email,
      supervisorName: name.trim(),
      loginUsername: systemUsername,
      loginPassword: systemPassword,
    });

    return res.status(201).json({
      message: 'Supervisor created and credentials sent by email',
      supervisor: { _id: supervisor._id, name: supervisor.name, email: supervisor.email, username: supervisor.username, role: supervisor.role, site: supervisor.site },
    });
  } catch (error) {
    console.error('CREATE SUPERVISOR ERROR:', error.message);
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ message: `${field === 'email' ? 'Email' : 'Username'} already in use` });
    }
    return res.status(500).json({ message: error.message });
  }
};

// ─── Admin: Update Supervisor ─────────────────────────────────────────────────
const updateSupervisor = async (req, res) => {
  try {
    const { name, email, site } = req.body;
    const supervisor = await User.findById(req.params.id);
    if (!supervisor || supervisor.role !== 'supervisor') return res.status(404).json({ message: 'Supervisor not found' });

    if (email && email !== supervisor.email) {
      if (await User.findOne({ email: email.toLowerCase().trim() })) return res.status(400).json({ message: 'Email already in use' });
      supervisor.email = email.toLowerCase().trim();
    }
    if (name) supervisor.name = name.trim();
    if (site !== undefined) supervisor.site = site;

    await supervisor.save();
    return res.status(200).json({
      message: 'Supervisor updated successfully',
      supervisor: { _id: supervisor._id, name: supervisor.name, email: supervisor.email, username: supervisor.username, role: supervisor.role, site: supervisor.site },
    });
  } catch (error) {
    console.error('UPDATE ERROR:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

// ─── Admin: Delete Supervisor ─────────────────────────────────────────────────
const deleteSupervisor = async (req, res) => {
  try {
    const supervisor = await User.findById(req.params.id);
    if (!supervisor || supervisor.role !== 'supervisor') return res.status(404).json({ message: 'Supervisor not found' });
    await supervisor.deleteOne();
    return res.status(200).json({ message: 'Supervisor deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ─── Get Sites ────────────────────────────────────────────────────────────────
const getSites = async (req, res) => {
  try {
    const sites = await User.distinct('site', { role: 'supervisor', site: { $ne: null } });
    return res.status(200).json(sites);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser, loginUser, adminLogin, selectSite, getProfile,
  getSupervisors, createSupervisor, updateSupervisor, deleteSupervisor, getSites,
};
