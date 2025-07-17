import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../../config';
import './Login.css';

const Login = () => {
    const [formData, setFormData] = useState({
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
        
        // Clear errors when user starts typing
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

    // Validate form
    const validateForm = () => {
        const newErrors = {};

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
            console.log('Sending login request:', formData);
            
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email.trim().toLowerCase(),
                    password: formData.password
                })
            });

            const data = await response.json();
            console.log('Login response:', data);

            if (data.success) {
                // Store authentication data in both localStorage and sessionStorage
                localStorage.setItem('auth-token', data.authtoken);
                localStorage.setItem('email', data.user.email);
                localStorage.setItem('name', data.user.name);
                localStorage.setItem('phone', data.user.phone);
                localStorage.setItem('role', data.user.role);
                
                // Also store in sessionStorage for compatibility
                sessionStorage.setItem('auth-token', data.authtoken);
                sessionStorage.setItem('email', data.user.email);
                sessionStorage.setItem('name', data.user.name);
                sessionStorage.setItem('phone', data.user.phone);
                sessionStorage.setItem('role', data.user.role);
                
                setSuccessMessage('Login successful! Redirecting...');
                
                // Redirect based on user role
                setTimeout(() => {
                    switch (data.user.role) {
                        case 'admin':
                            navigate('/admin-dashboard');
                            break;
                        case 'doctor':
                            navigate('/doctor-dashboard');
                            break;
                        case 'patient':
                        default:
                            navigate('/');
                            break;
                    }
                    window.location.reload(); // Refresh to update authentication state
                }, 1500);
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
                    setErrorMessage(data.error || 'Login failed. Please check your credentials.');
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            setErrorMessage('Network error. Please check your connection and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle form reset
    const handleReset = () => {
        setFormData({
            email: '',
            password: ''
        });
        setErrors({});
        setSuccessMessage('');
        setErrorMessage('');
    };

    // Handle forgot password
    const handleForgotPassword = () => {
        // For now, just show an alert
        alert('Password reset functionality will be implemented soon!');
    };

    return (
        <div className="login-container">
            <div className="login-form-wrapper">
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

                <div className="login-header">
                    <h1>Login</h1>
                    <p>Are you a new member? <Link to="/signup">Sign Up Here</Link></p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    {/* Email Field */}
                    <div className="form-group">
                        <label htmlFor="email">Email *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
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
                                placeholder="Enter your password"
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
                            className="login-btn"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Logging in...' : 'Login'}
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

                {/* Forgot Password */}
                <div className="forgot-password">
                    <button 
                        type="button" 
                        className="forgot-password-link"
                        onClick={handleForgotPassword}
                    >
                        Forgot Password?
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;