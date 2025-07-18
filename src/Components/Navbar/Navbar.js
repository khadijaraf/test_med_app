import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('');
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const navigate = useNavigate();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Check authentication status
    useEffect(() => {
        const checkAuthStatus = () => {
            const token = sessionStorage.getItem('auth-token') || localStorage.getItem('auth-token');
            const name = sessionStorage.getItem('name') || localStorage.getItem('name');
            const email = sessionStorage.getItem('email') || localStorage.getItem('email');
            const role = sessionStorage.getItem('role') || localStorage.getItem('role');
            
            if (token) {
                setIsLoggedIn(true);
                setUserRole(role || 'patient');
                
                // Use name if available, otherwise extract from email
                if (name) {
                    setUserName(name);
                } else if (email) {
                    // Extract name from email (part before @)
                    const extractedName = email.split('@')[0];
                    setUserName(extractedName);
                } else {
                    setUserName('User');
                }
            } else {
                setIsLoggedIn(false);
                setUserName('');
                setUserRole('');
            }
        };

        checkAuthStatus();
        
        // Listen for storage changes (when user logs in/out in another tab)
        window.addEventListener('storage', checkAuthStatus);
        
        // Close dropdown when clicking outside
        const handleClickOutside = (event) => {
            if (!event.target.closest('.profile-dropdown')) {
                setShowProfileDropdown(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        
        return () => {
            window.removeEventListener('storage', checkAuthStatus);
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    // Toggle mobile menu
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    // Close mobile menu when clicking on a link
    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    // Toggle profile dropdown
    const toggleProfileDropdown = () => {
        setShowProfileDropdown(!showProfileDropdown);
    };

    // Handle navigation
    const handleNavClick = (path) => {
        navigate(path);
        closeMobileMenu();
        setShowProfileDropdown(false);
    };

    // Handle logout
    const handleLogout = () => {
        // Clear session storage
        sessionStorage.removeItem('auth-token');
        sessionStorage.removeItem('name');
        sessionStorage.removeItem('email');
        sessionStorage.removeItem('phone');
        sessionStorage.removeItem('role');
        
        // Clear local storage
        localStorage.removeItem('auth-token');
        localStorage.removeItem('name');
        localStorage.removeItem('email');
        localStorage.removeItem('phone');
        localStorage.removeItem('role');
        
        // Update state
        setIsLoggedIn(false);
        setUserName('');
        setUserRole('');
        setShowProfileDropdown(false);
        
        // Navigate to home and close mobile menu
        navigate('/');
        closeMobileMenu();
        
        // Refresh page to update all components
        window.location.reload();
    };

    return (
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''} ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
            <div className="navbar-container">
                {/* Logo Section */}
                <div className="navbar-logo" onClick={() => handleNavClick('/')}>
                    <span className="logo-icon">🏥</span>
                    <span className="logo-text">StayHealthy</span>
                </div>

                {/* Navigation Links */}
                <ul className="navbar-menu">
                    <li className="navbar-item">
                        <a href="/" className="navbar-link" onClick={(e) => { e.preventDefault(); handleNavClick('/'); }}>
                            Home
                        </a>
                    </li>
                    <li className="navbar-item">
                        <a href="/instant-consultation" className="navbar-link" onClick={(e) => { e.preventDefault(); handleNavClick('/instant-consultation'); }}>
                            Find Doctors
                        </a>
                    </li>
                    <li className="navbar-item">
                        <a href="/appointments" className="navbar-link" onClick={(e) => { e.preventDefault(); handleNavClick('/appointments'); }}>
                            Appointments
                        </a>
                    </li>
                    <li className="navbar-item">
                        <a href="/health-blog" className="navbar-link" onClick={(e) => { e.preventDefault(); handleNavClick('/health-blog'); }}>
                            Health Blog
                        </a>
                    </li>
                    <li className="navbar-item">
                        <a href="/reviews" className="navbar-link" onClick={(e) => { e.preventDefault(); handleNavClick('/reviews'); }}>
                            Reviews
                        </a>
                    </li>
                </ul>

                {/* Auth Buttons - Conditional Rendering */}
                <div className="navbar-auth">
                    {isLoggedIn ? (
                        <>
                            <div className="profile-dropdown">
                                <button 
                                    className="profile-dropdown-btn"
                                    onClick={toggleProfileDropdown}
                                >
                                    <span className="welcome-user">
                                        Welcome, {userName}! 
                                        {userRole && <span className="user-role">({userRole})</span>}
                                    </span>
                                    <span className="dropdown-arrow">▼</span>
                                </button>
                                
                                {showProfileDropdown && (
                                    <div className="dropdown-menu">
                                        <button 
                                            className="dropdown-item"
                                            onClick={() => handleNavClick('/profile')}
                                        >
                                            <span className="dropdown-icon">👤</span>
                                            Your Profile
                                        </button>
                                        <button 
                                            className="dropdown-item"
                                            onClick={() => handleNavClick('/appointments')}
                                        >
                                            <span className="dropdown-icon">📅</span>
                                            My Appointments
                                        </button>
                                        <div className="dropdown-divider"></div>
                                        <button 
                                            className="dropdown-item logout-item"
                                            onClick={handleLogout}
                                        >
                                            <span className="dropdown-icon">🚪</span>
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <a href="/signup" className="auth-btn signup-btn" onClick={(e) => { e.preventDefault(); handleNavClick('/signup'); }}>
                                Sign Up
                            </a>
                            <a href="/login" className="auth-btn login-btn" onClick={(e) => { e.preventDefault(); handleNavClick('/login'); }}>
                                Login
                            </a>
                        </>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <div
                    className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
                    onClick={toggleMobileMenu}
                    role="button"
                    aria-label="Toggle mobile menu"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            toggleMobileMenu();
                        }
                    }}
                >
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
                <ul className="mobile-menu-items">
                    <li className="mobile-menu-item">
                        <a href="/" className="mobile-menu-link" onClick={(e) => { e.preventDefault(); handleNavClick('/'); }}>
                            Home
                        </a>
                    </li>
                    <li className="mobile-menu-item">
                        <a href="/instant-consultation" className="mobile-menu-link" onClick={(e) => { e.preventDefault(); handleNavClick('/instant-consultation'); }}>
                            Find Doctors
                        </a>
                    </li>
                    <li className="mobile-menu-item">
                        <a href="/appointments" className="mobile-menu-link" onClick={(e) => { e.preventDefault(); handleNavClick('/appointments'); }}>
                            Appointments
                        </a>
                    </li>
                    <li className="mobile-menu-item">
                        <a href="/health-blog" className="mobile-menu-link" onClick={(e) => { e.preventDefault(); handleNavClick('/health-blog'); }}>
                            Health Blog
                        </a>
                    </li>
                    <li className="mobile-menu-item">
                        <a href="/reviews" className="mobile-menu-link" onClick={(e) => { e.preventDefault(); handleNavClick('/reviews'); }}>
                            Reviews
                        </a>
                    </li>
                    
                    {/* Mobile Auth Buttons - Conditional Rendering */}
                    {isLoggedIn ? (
                        <>
                            <li className="mobile-menu-item">
                                <span className="mobile-welcome-user">
                                    Welcome, {userName}!
                                    {userRole && <span className="user-role">({userRole})</span>}
                                </span>
                            </li>
                            <li className="mobile-menu-item">
                                <a href="/profile" className="mobile-menu-link" onClick={(e) => { e.preventDefault(); handleNavClick('/profile'); }}>
                                    👤 Your Profile
                                </a>
                            </li>
                            <li className="mobile-menu-item">
                                <a href="/appointments" className="mobile-menu-link" onClick={(e) => { e.preventDefault(); handleNavClick('/appointments'); }}>
                                    📅 My Appointments
                                </a>
                            </li>
                            <li className="mobile-menu-item">
                                <button 
                                    className="mobile-auth-btn mobile-logout-btn" 
                                    onClick={handleLogout}
                                >
                                    🚪 Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="mobile-menu-item">
                                <a href="/signup" className="mobile-auth-btn mobile-signup-btn" onClick={(e) => { e.preventDefault(); handleNavClick('/signup'); }}>
                                    Sign Up Now
                                </a>
                            </li>
                            <li className="mobile-menu-item">
                                <a href="/login" className="mobile-auth-btn mobile-login-btn" onClick={(e) => { e.preventDefault(); handleNavClick('/login'); }}>
                                    Login
                                </a>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;