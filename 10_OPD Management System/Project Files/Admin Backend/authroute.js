const express = require('express');
const router = express.Router();
const authController = require('./Authcontroller');
const { authenticateToken, authorizeRoles } = require('./authmiddleware');

// ==================== AUTH ROUTES ====================

// Public routes
router.post('/auth/register', authController.registerUser);
router.post('/auth/login', authController.loginUser);
router.post('/auth/forgot-password', authController.forgotPassword);

// Protected routes (require authentication)
router.get('/auth/me', authenticateToken, authController.getCurrentUser);
router.post('/auth/change-password', authenticateToken, authController.changePassword);

// Admin only routes example
router.get('/auth/admin-only', 
    authenticateToken, 
    authorizeRoles('Admin'), 
    (req, res) => {
        res.json({ 
            success: true, 
            message: 'Welcome Admin!' 
        });
    }
);

module.exports = router;