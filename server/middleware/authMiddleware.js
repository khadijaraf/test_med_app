const jwt = require('jsonwebtoken');
const UserSchema = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'thisismysecretuniquekeywithjsonwebtoken';

// Middleware to verify JWT token
const verifyToken = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('auth-token') || req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'Access denied. No token provided.'
            });
        }

        // Verify token
        const verified = jwt.verify(token, JWT_SECRET);
        
        // Get user from database
        const user = await UserSchema.findById(verified.user.id).select('-password');
        
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Token is valid but user not found'
            });
        }

        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                error: 'User account is deactivated'
            });
        }

        // Add user info to request object
        req.user = user;
        req.userId = user._id;
        
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                error: 'Token has expired'
            });
        }
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                error: 'Invalid token'
            });
        }
        
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            error: 'Authentication required'
        });
    }
    
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            error: 'Admin access required'
        });
    }
    
    next();
};

// Middleware to check if user is doctor
const requireDoctor = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            error: 'Authentication required'
        });
    }
    
    if (req.user.role !== 'doctor' && req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            error: 'Doctor access required'
        });
    }
    
    next();
};

// Middleware to check if user is patient
const requirePatient = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            error: 'Authentication required'
        });
    }
    
    if (req.user.role !== 'patient') {
        return res.status(403).json({
            success: false,
            error: 'Patient access required'
        });
    }
    
    next();
};

// Middleware to check multiple roles
const requireRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required'
            });
        }
        
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: `Access denied. Required roles: ${roles.join(', ')}`
            });
        }
        
        next();
    };
};

module.exports = {
    verifyToken,
    requireAdmin,
    requireDoctor,
    requirePatient,
    requireRoles
};