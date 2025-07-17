import React from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, hasRole } from '../utils/authUtils';

// Wrapper for routes that require authentication
export const RequireAuth = (WrappedComponent) => {
    return (props) => {
        const navigate = useNavigate();

        React.useEffect(() => {
            if (!isAuthenticated()) {
                navigate('/login');
            }
        }, [navigate]);

        if (!isAuthenticated()) return null;

        return <WrappedComponent {...props} />;
    };
};

// Wrapper for routes that require a specific role
export const RequireRole = (WrappedComponent, requiredRole) => {
    return (props) => {
        const navigate = useNavigate();

        React.useEffect(() => {
            if (!isAuthenticated()) {
                navigate('/login');
            } else if (!hasRole(requiredRole)) {
                navigate('/unauthorized');
            }
        }, [navigate]);

        if (!isAuthenticated() || !hasRole(requiredRole)) return null;

        return <WrappedComponent {...props} />;
    };
};
