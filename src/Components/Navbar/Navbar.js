import React, { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Toggle mobile menu
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    // Close mobile menu when clicking on a link
    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    // Handle navigation clicks
    const handleNavClick = (href) => {
        // Add your navigation logic here
        console.log('Navigating to:', href);
        closeMobileMenu();
    };

    return (
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''} ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
            <div className="navbar-container">
                {/* Logo Section */}
                <div className="navbar-logo" onClick={() => handleNavClick('#home')}>
                    <span className="logo-icon">🏥</span>
                    <span className="logo-text">StayHealthy</span>
                </div>

                {/* Navigation Links */}
                <ul className="navbar-menu">
                    <li className="navbar-item">
                        <a 
                            href="#home" 
                            className="navbar-link"
                            onClick={(e) => {
                                e.preventDefault();
                                handleNavClick('#home');
                            }}
                        >
                            Home
                        </a>
                    </li>
                    <li className="navbar-item">
                        <a 
                            href="#appointments" 
                            className="navbar-link"
                            onClick={(e) => {
                                e.preventDefault();
                                handleNavClick('#appointments');
                            }}
                        >
                            Appointments
                        </a>
                    </li>
                    <li className="navbar-item">
                        <a 
                            href="#health-blog" 
                            className="navbar-link"
                            onClick={(e) => {
                                e.preventDefault();
                                handleNavClick('#health-blog');
                            }}
                        >
                            Health Blog
                        </a>
                    </li>
                    <li className="navbar-item">
                        <a 
                            href="#reviews" 
                            className="navbar-link"
                            onClick={(e) => {
                                e.preventDefault();
                                handleNavClick('#reviews');
                            }}
                        >
                            Reviews
                        </a>
                    </li>
                </ul>

                {/* Auth Buttons */}
                <div className="navbar-auth">
                    <a 
                        href="#signup" 
                        className="auth-btn signup-btn"
                        onClick={(e) => {
                            e.preventDefault();
                            handleNavClick('#signup');
                        }}
                    >
                        Sign Up
                    </a>
                    <a 
                        href="#login" 
                        className="auth-btn login-btn"
                        onClick={(e) => {
                            e.preventDefault();
                            handleNavClick('#login');
                        }}
                    >
                        Login
                    </a>
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
                        <a 
                            href="#home" 
                            className="mobile-menu-link"
                            onClick={(e) => {
                                e.preventDefault();
                                handleNavClick('#home');
                            }}
                        >
                            Home
                        </a>
                    </li>
                    <li className="mobile-menu-item">
                        <a 
                            href="#appointments" 
                            className="mobile-menu-link"
                            onClick={(e) => {
                                e.preventDefault();
                                handleNavClick('#appointments');
                            }}
                        >
                            Appointments
                        </a>
                    </li>
                    <li className="mobile-menu-item">
                        <a 
                            href="#health-blog" 
                            className="mobile-menu-link"
                            onClick={(e) => {
                                e.preventDefault();
                                handleNavClick('#health-blog');
                            }}
                        >
                            Health Blog
                        </a>
                    </li>
                    <li className="mobile-menu-item">
                        <a 
                            href="#reviews" 
                            className="mobile-menu-link"
                            onClick={(e) => {
                                e.preventDefault();
                                handleNavClick('#reviews');
                            }}
                        >
                            Reviews
                        </a>
                    </li>
                    <li className="mobile-menu-item">
                        <a 
                            href="#signup" 
                            className="mobile-auth-btn mobile-signup-btn"
                            onClick={(e) => {
                                e.preventDefault();
                                handleNavClick('#signup');
                            }}
                        >
                            Sign Up
                        </a>
                    </li>
                    <li className="mobile-menu-item">
                        <a 
                            href="#login" 
                            className="mobile-auth-btn mobile-login-btn"
                            onClick={(e) => {
                                e.preventDefault();
                                handleNavClick('#login');
                            }}
                        >
                            Login
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;