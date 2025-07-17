import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../../config';
import "./Sign_up.css";

const Sign_Up = () => {
    const [formData, setFormData] = useState({
        role: 'patient',
        name: '',
        phone: '',
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear specific field error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
        
        // Clear general error messages
        if (errorMessage) {
            setErrorMessage('');
        }
    };

    // Client-side form validation
    const validateForm = () => {
        const newErrors = {};

        if (!formData.role) {
            newErrors.role = 'Please select a role';
        }

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }
        
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (formData.phone.trim().length < 10) {
            newErrors.phone = 'Phone number must be at least 10 digits';
        } else if (!/^\d+$/.test(formData.phone.trim())) {
            newErrors.phone = 'Phone number should contain only digits';
        }
        
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
            newErrors.email = 'Please enter a valid email';
        }
        
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        return newErrors;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        setIsLoading(true);
        setErrors({});
        setErrorMessage('');
        setSuccessMessage('');

        try {
            console.log('Sending registration request:', formData);
            
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.name.trim(),
                    email: formData.email.trim().toLowerCase(),
                    password: formData.password,
                    phone: formData.phone.trim(),
                    role: formData.role
                }),
            });

            const data = await response.json();
            console.log('Registration response:', data);

            if (data.success) {
                // Store authentication data
                sessionStorage.setItem("auth-token", data.authtoken);
                sessionStorage.setItem("name", data.user.name);
                sessionStorage.setItem("phone", data.user.phone);
                sessionStorage.setItem("email", data.user.email);
                sessionStorage.setItem("role", data.user.role);
                
                setSuccessMessage('Registration successful! Redirecting to home...');
                
                // Redirect to home page after 2 seconds
                setTimeout(() => {
                    navigate("/");
                    window.location.reload();
                }, 2000);
            } else {
                // Handle server validation errors
                if (data.errors && Array.isArray(data.errors)) {
                    const newErrors = {};
                    data.errors.forEach(error => {
                        if (error.path) {
                            newErrors[error.path] = error.msg;
                        }
                    });
                    setErrors(newErrors);
                } else {
                    setErrorMessage(data.error || 'Registration failed. Please try again.');
                }
            }
        } catch (error) {
            console.error('Registration error:', error);
            setErrorMessage('Network error. Please check your connection and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle form reset
    const handleReset = () => {
        setFormData({
            role: 'patient',
            name: '',
            phone: '',
            email: '',
            password: ''
        });
        setErrors({});
        setSuccessMessage('');
        setErrorMessage('');
    };

    return (
        <div className="signup-container">
            <div className="signup-form-wrapper">
                {successMessage && (
                    <div className="success-message" style={{
                        color: 'green', 
                        marginBottom: '20px', 
                        padding: '10px', 
                        background: '#f0f9ff', 
                        border: '1px solid #0ea5e9', 
                        borderRadius: '8px',
                        textAlign: 'center'
                    }}>
                        {successMessage}
                    </div>
                )}

                {errorMessage && (
                    <div className="error-message" style={{
                        color: 'red', 
                        marginBottom: '20px', 
                        padding: '10px', 
                        background: '#fef2f2', 
                        border: '1px solid #fecaca', 
                        borderRadius: '8px',
                        textAlign: 'center'
                    }}>
                        {errorMessage}
                    </div>
                )}

                <div className="signup-header">
                    <h1>Sign Up</h1>
                    <p>Already a member? <Link to="/login">Login</Link></p>
                </div>

                <form method="POST" onSubmit={handleSubmit} className="signup-form">
                    {/* Role Selection */}
                    <div className="form-group">
                        <label htmlFor="role">Role *</label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className={errors.role ? 'error' : ''}
                            required
                        >
                            <option value="">Select role</option>
                            <option value="patient">Patient</option>
                            <option value="doctor">Doctor</option>
                            <option value="admin">Admin</option>
                        </select>
                        {errors.role && <span className="error-text">{errors.role}</span>}
                    </div>

                    {/* Name Field */}
                    <div className="form-group">
                        <label htmlFor="name">Name *</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            className={errors.name ? 'error' : ''}
                            required
                        />
                        {errors.name && <span className="error-text">{errors.name}</span>}
                    </div>

                    {/* Phone Field */}
                    <div className="form-group">
                        <label htmlFor="phone">Phone Number *</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter your phone number"
                            className={errors.phone ? 'error' : ''}
                            required
                        />
                        {errors.phone && <span className="error-text">{errors.phone}</span>}
                    </div>

                    {/* Email Field */}
                    <div className="form-group">
                        <label htmlFor="email">Email *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email address"
                            className={errors.email ? 'error' : ''}
                            required
                        />
                        {errors.email && <span className="error-text">{errors.email}</span>}
                    </div>

                    {/* Password Field */}
                    <div className="form-group">
                        <label htmlFor="password">Password *</label>
                        <div className="password-field">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password (min 8 characters)"
                                className={errors.password ? 'error' : ''}
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label="Toggle password visibility"
                            >
                                {showPassword ? '👁️' : '🙈'}
                            </button>
                        </div>
                        {errors.password && <span className="error-text">{errors.password}</span>}
                    </div>

                    {/* Buttons */}
                    <div className="button-group">
                        <button 
                            type="submit" 
                            className="submit-btn"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </button>
                        <button 
                            type="button" 
                            className="reset-btn"
                            onClick={handleReset}
                            disabled={isLoading}
                        >
                            Reset
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Sign_Up;