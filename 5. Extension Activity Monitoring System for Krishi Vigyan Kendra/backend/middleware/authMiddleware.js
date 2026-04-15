const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      try {
        req.user = await User.findById(decoded.id).select('-password');
      } catch (err) {
        console.error('Auth middleware user lookup failed (DB might be down):', err);
      }

      // If user not in DB (disaster recovery), use token payload
      if (!req.user && decoded.role) {
        req.user = {
          _id: decoded.id,
          id: decoded.id,
          role: decoded.role,
          name: 'Admin (Recovery Mode)',
          email: 'admin@recovery.mode'
        };
      }

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Admin only middleware
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin only.' });
  }
};

// Admin or Program Assistant only middleware
const adminOrProgramAssistant = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'program_assistant')) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin or Program Assistant only.' });
  }
};

// Check if user has permission for a discipline
const checkDisciplineAccess = (discipline) => {
  return (req, res, next) => {
    // Admin has access to all disciplines
    if (req.user.role === 'admin') {
      return next();
    }

    // Check if scientist has access to this discipline
    if (req.user.assignedDisciplines && req.user.assignedDisciplines.includes(discipline)) {
      return next();
    }

    res.status(403).json({ message: `Access denied. You don't have permission for ${discipline}.` });
  };
};

// Check specific permission for a discipline
const checkPermission = (discipline, permission) => {
  return (req, res, next) => {
    // Admin has all permissions
    if (req.user.role === 'admin') {
      return next();
    }

    // Check if scientist has the specific permission
    const userPermissions = req.user.permissions?.get(discipline) || [];
    
    if (userPermissions.includes(permission)) {
      return next();
    }

    res.status(403).json({ 
      message: `Access denied. You don't have ${permission} permission for ${discipline}.` 
    });
  };
};

// Optional auth - reads JWT if present, does NOT block unauthenticated requests.
const optionalProtect = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      // Token invalid – proceed without user
    }
  }
  next();
};

module.exports = { protect, adminOnly, adminOrProgramAssistant, checkDisciplineAccess, checkPermission, optionalProtect };
