const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your-secret-key-change-this-in-production';

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access token required'
        });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }

        req.userId = user.id;
        req.userRole = user.role;
        req.userEmail = user.email;
        next();
    });
};

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.userRole) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        if (!roles.includes(req.userRole)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Required roles: ${roles.join(', ')}`
            });
        }

        next();
    };
};

module.exports = {
    authenticateToken,
    authorizeRoles
};