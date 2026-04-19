const User = require('./Usermodel');
const jwt = require('jsonwebtoken');

// JWT Secret - in production, use environment variable
const JWT_SECRET = 'your-secret-key-change-this-in-production';

// ==================== REGISTER USER ====================
const registerUser = async (req, res) => {
    try {
        console.log("=".repeat(60));
        console.log("📝 USER REGISTRATION REQUEST RECEIVED");
        console.log("=".repeat(60));
        console.log("Request Body:", JSON.stringify(req.body, null, 2));
        console.log("-".repeat(60));

        const { name, email, password, role, phone, department } = req.body;

        // Validate required fields
        const missingFields = [];
        if (!name) missingFields.push('name');
        if (!email) missingFields.push('email');
        if (!password) missingFields.push('password');

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing",
                missingFields
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User with this email already exists"
            });
        }

        // Create new user
        const newUser = new User({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password,
            role: role || 'Staff',
            phone: phone || '',
            department: department || ''
        });

        console.log("💾 Saving user...");
        const savedUser = await newUser.save();

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: savedUser._id, 
                userId: savedUser.userId,
                email: savedUser.email, 
                role: savedUser.role 
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log("✅ USER REGISTERED SUCCESSFULLY!");
        console.log("User ID:", savedUser.userId);
        console.log("Name:", savedUser.name);
        console.log("Role:", savedUser.role);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user: {
                id: savedUser._id,
                userId: savedUser.userId,
                name: savedUser.name,
                email: savedUser.email,
                role: savedUser.role,
                profileImage: savedUser.profileImage
            }
        });

    } catch (error) {
        console.error("❌ ERROR:", error);

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "User with this email already exists"
            });
        }

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }

        res.status(500).json({
            success: false,
            message: error.message || "Failed to register user"
        });
    }
};

// ==================== LOGIN USER ====================
const loginUser = async (req, res) => {
    try {
        console.log("=".repeat(60));
        console.log("🔐 LOGIN REQUEST RECEIVED");
        console.log("=".repeat(60));
        console.log("Email:", req.body.email);

        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });
        
        if (!user) {
            console.log("❌ User not found with email:", email);
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Check if account is active
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Your account has been deactivated. Please contact admin."
            });
        }

        // Compare password
        const isPasswordValid = await user.comparePassword(password);
        
        if (!isPasswordValid) {
            console.log("❌ Invalid password for user:", email);
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: user._id, 
                userId: user.userId,
                email: user.email, 
                role: user.role,
                name: user.name
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log("✅ LOGIN SUCCESSFUL!");
        console.log("User ID:", user.userId);
        console.log("Name:", user.name);
        console.log("Role:", user.role);

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                userId: user.userId,
                name: user.name,
                email: user.email,
                role: user.role,
                profileImage: user.profileImage
            }
        });

    } catch (error) {
        console.error("❌ ERROR:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to login"
        });
    }
};

// ==================== GET CURRENT USER ====================
const getCurrentUser = async (req, res) => {
    try {
        // User id from token (set by auth middleware)
        const userId = req.userId;
        
        const user = await User.findById(userId).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        console.error("❌ ERROR:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to get user"
        });
    }
};

// ==================== CHANGE PASSWORD ====================
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.userId;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Current password and new password are required"
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "New password must be at least 6 characters"
            });
        }

        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Verify current password
        const isPasswordValid = await user.comparePassword(currentPassword);
        
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect"
            });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });

    } catch (error) {
        console.error("❌ ERROR:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to change password"
        });
    }
};

// ==================== FORGOT PASSWORD ====================
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        
        if (!user) {
            // Don't reveal if user exists or not for security
            return res.status(200).json({
                success: true,
                message: "If your email is registered, you will receive reset instructions"
            });
        }

        // Generate password reset token
        const resetToken = jwt.sign(
            { id: user._id },
            JWT_SECRET + user.password, // Add password hash to make token invalid after password change
            { expiresIn: '1h' }
        );

        // In production, send email with reset link
        // For now, just return token
        console.log("🔑 Reset token for", email, ":", resetToken);

        res.status(200).json({
            success: true,
            message: "If your email is registered, you will receive reset instructions",
            // Remove in production - only for testing
            resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined
        });

    } catch (error) {
        console.error("❌ ERROR:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to process request"
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getCurrentUser,
    changePassword,
    forgotPassword
};