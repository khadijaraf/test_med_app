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

    const navigate = useNavigate();

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email';
        
        if (!formData.password) newErrors.password = 'Password is required';

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

        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                // Store the token in localStorage
                localStorage.setItem('token', data.authtoken);
                localStorage.setItem('email', formData.email);
                
                setSuccessMessage('Login successful! Redirecting...');
                setTimeout(() => {
                    navigate('/');
                }, 1500);
            } else {
                setErrors({ submit: data.error || 'Login failed. Please check your credentials.' });
            }
        } catch (error) {
            console.error('Login error:', error);
            setErrors({ submit: 'Network error. Please try again.' });
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
                    <div className="success-message">
                        {successMessage}
                    </div>
                )}

                <div className="login-header">
                    <h1>Login</h1>
                    <p>Are you a new member? <Link to="/signup">Sign Up Here</Link></p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    {/* Email Field */}
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            className={errors.email ? 'error' : ''}
                        />
                        {errors.email && <span className="error-text">{errors.email}</span>}
                    </div>

                    {/* Password Field */}
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="password-field">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                className={errors.password ? 'error' : ''}
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? '👁️' : '🙈'}
                            </button>
                        </div>
                        {errors.password && <span className="error-text">{errors.password}</span>}
                    </div>

                    {/* Submit Error */}
                    {errors.submit && <div className="error-message">{errors.submit}</div>}

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