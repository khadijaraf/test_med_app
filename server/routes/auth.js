const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const UserSchema = require('../models/User');
const passport = require('passport');

const dotenv = require('dotenv');
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'thisismysecretuniquekeywithjsonwebtoken';

// Session configuration
router.use(session({
    secret: process.env.SESSION_SECRET || 'your-session-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Only secure in production
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
    },
}));

// Passport configuration
router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser(function (user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
    cb(null, id);
});

// Route 1: Register a new user
router.post('/register', [
    body('email', "Please enter a valid email").isEmail().normalizeEmail(),
    body('name', "Name should be at least 2 characters").isLength({ min: 2 }).trim(),
    body('password', "Password should be at least 8 characters").isLength({ min: 8 }),
    body('phone', "Phone number should be at least 10 digits").isLength({ min: 10 }).trim(),
    body('role', "Please select a valid role").isIn(['patient', 'doctor', 'admin']).optional(),
], async (req, res) => {
    console.log('Registration request received:', req.body);

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array());
        return res.status(400).json({ 
            success: false,
            errors: errors.array() 
        });
    }

    try {
        const { email, name, password, phone, role = 'patient' } = req.body;

        // Check if user already exists
        const existingUser = await UserSchema.findOne({ email });
        if (existingUser) {
            console.log('User already exists with email:', email);
            return res.status(400).json({ 
                success: false,
                error: "A user with this email address already exists" 
            });
        }

        // Check if phone number already exists
        const existingPhone = await UserSchema.findOne({ phone });
        if (existingPhone) {
            console.log('User already exists with phone:', phone);
            return res.status(400).json({ 
                success: false,
                error: "A user with this phone number already exists" 
            });
        }

        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user
        const newUser = new UserSchema({
            email,
            name,
            password: hashedPassword,
            phone,
            role,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        const savedUser = await newUser.save();
        console.log('User created successfully:', savedUser.id);

        // Create JWT payload
        const payload = {
            user: {
                id: savedUser.id,
                email: savedUser.email,
                role: savedUser.role
            }
        };

        // Generate JWT token
        const authToken = jwt.sign(payload, JWT_SECRET, { 
            expiresIn: '24h' 
        });

        // Store user info in session
        req.session.userId = savedUser.id;
        req.session.email = savedUser.email;
        req.session.role = savedUser.role;

        // Send success response
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            authtoken: authToken,
            user: {
                id: savedUser.id,
                name: savedUser.name,
                email: savedUser.email,
                phone: savedUser.phone,
                role: savedUser.role
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        
        // Handle specific MongoDB errors
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({
                success: false,
                error: `A user with this ${field} already exists`
            });
        }

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => ({
                field: err.path,
                message: err.message
            }));
            return res.status(400).json({
                success: false,
                error: "Validation failed",
                errors: validationErrors
            });
        }

        return res.status(500).json({
            success: false,
            error: "Internal server error. Please try again later."
        });
    }
});

// Route 2: Login user
router.post('/login', [
    body('email', "Please enter a valid email").isEmail().normalizeEmail(),
    body('password', "Password is required").exists(),
], async (req, res) => {
    console.log('Login request received for:', req.body.email);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false,
            errors: errors.array() 
        });
    }

    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await UserSchema.findOne({ email });
        if (!user) {
            console.log('User not found:', email);
            return res.status(400).json({ 
                success: false,
                error: "Invalid credentials" 
            });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log('Invalid password for user:', email);
            return res.status(400).json({ 
                success: false,
                error: "Invalid credentials" 
            });
        }

        // Create JWT payload
        const payload = {
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        };

        // Generate JWT token
        const authToken = jwt.sign(payload, JWT_SECRET, { 
            expiresIn: '24h' 
        });

        // Store user info in session
        req.session.userId = user.id;
        req.session.email = user.email;
        req.session.role = user.role;

        console.log('User logged in successfully:', user.id);

        res.json({
            success: true,
            message: "Login successful",
            authtoken: authToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            error: "Internal server error. Please try again later."
        });
    }
});

// Route 3: Get user profile
router.get('/user', async (req, res) => {
    try {
        const email = req.headers.email;
        
        if (!email) {
            return res.status(400).json({ 
                success: false,
                error: "Email not provided in headers" 
            });
        }

        const user = await UserSchema.findOne({ email }).select('-password');
        if (!user) {
            return res.status(404).json({ 
                success: false,
                error: "User not found" 
            });
        }

        res.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            }
        });

    } catch (error) {
        console.error('Get user error:', error);
        return res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
});

// Route 4: Update user profile
router.put('/user', [
    body('name', "Name should be at least 2 characters").isLength({ min: 2 }).trim(),
    body('phone', "Phone number should be at least 10 digits").isLength({ min: 10 }).trim(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false,
            errors: errors.array() 
        });
    }

    try {
        const email = req.headers.email;
        
        if (!email) {
            return res.status(400).json({ 
                success: false,
                error: "Email not provided in headers" 
            });
        }

        const user = await UserSchema.findOne({ email });
        if (!user) {
            return res.status(404).json({ 
                success: false,
                error: "User not found" 
            });
        }

        // Check if phone number is already taken by another user
        if (req.body.phone && req.body.phone !== user.phone) {
            const existingPhone = await UserSchema.findOne({ 
                phone: req.body.phone, 
                _id: { $ne: user._id } 
            });
            if (existingPhone) {
                return res.status(400).json({ 
                    success: false,
                    error: "Phone number already exists" 
                });
            }
        }

        // Update user fields
        user.name = req.body.name || user.name;
        user.phone = req.body.phone || user.phone;
        user.updatedAt = new Date();

        const updatedUser = await user.save();

        // Create new JWT token
        const payload = {
            user: {
                id: updatedUser.id,
                email: updatedUser.email,
                role: updatedUser.role
            }
        };

        const authToken = jwt.sign(payload, JWT_SECRET, { 
            expiresIn: '24h' 
        });

        res.json({
            success: true,
            message: "Profile updated successfully",
            authtoken: authToken,
            user: {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                role: updatedUser.role,
                updatedAt: updatedUser.updatedAt
            }
        });

    } catch (error) {
        console.error('Update user error:', error);
        return res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
});

// Route 5: Logout user
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({
                success: false,
                error: "Could not log out"
            });
        }
        
        res.json({
            success: true,
            message: "Logged out successfully"
        });
    });
});

// Route 6: Verify token
router.get('/verify-token', (req, res) => {
    const token = req.header('auth-token');
    
    if (!token) {
        return res.status(401).json({
            success: false,
            error: "No token provided"
        });
    }

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        res.json({
            success: true,
            user: verified.user
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            error: "Invalid token"
        });
    }
});

module.exports = router;