const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        minlength: [2, 'Name should be at least 2 characters'],
        maxlength: [50, 'Name should not exceed 50 characters'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password should be at least 8 characters']
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        unique: true,
        minlength: [10, 'Phone number should be at least 10 digits'],
        maxlength: [15, 'Phone number should not exceed 15 digits'],
        trim: true,
        validate: {
            validator: function(v) {
                return /^\d+$/.test(v); // Only digits allowed
            },
            message: 'Phone number should contain only digits'
        }
    },
    role: {
        type: String,
        enum: {
            values: ['patient', 'doctor', 'admin'],
            message: 'Role must be either patient, doctor, or admin'
        },
        default: 'patient',
        required: [true, 'Role is required']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field before saving
UserSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Create compound indexes for better performance
UserSchema.index({ email: 1 });
UserSchema.index({ phone: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ email: 1, role: 1 });

// Instance method to check if user is admin
UserSchema.methods.isAdmin = function() {
    return this.role === 'admin';
};

// Instance method to check if user is doctor
UserSchema.methods.isDoctor = function() {
    return this.role === 'doctor';
};

// Instance method to check if user is patient
UserSchema.methods.isPatient = function() {
    return this.role === 'patient';
};

// Static method to find users by role
UserSchema.statics.findByRole = function(role) {
    return this.find({ role: role });
};

// Transform the output to remove sensitive information
UserSchema.methods.toJSON = function() {
    const userObject = this.toObject();
    delete userObject.password;
    return userObject;
};

module.exports = mongoose.model('User', UserSchema);