// Authentication utility functions

// Check if user is authenticated
export const isAuthenticated = () => {
    const token = localStorage.getItem('auth-token') || sessionStorage.getItem('auth-token');
    return !!token;
};

// Get authentication token
export const getAuthToken = () => {
    return localStorage.getItem('auth-token') || sessionStorage.getItem('auth-token');
};

// Get user data from storage
export const getUserData = () => {
    const token = getAuthToken();
    if (!token) return null;

    return {
        email: localStorage.getItem('email') || sessionStorage.getItem('email'),
        name: localStorage.getItem('name') || sessionStorage.getItem('name'),
        phone: localStorage.getItem('phone') || sessionStorage.getItem('phone'),
        role: localStorage.getItem('role') || sessionStorage.getItem('role'),
        token: token
    };
};

// Get user role
export const getUserRole = () => {
    return localStorage.getItem('role') || sessionStorage.getItem('role');
};

// Check if user has specific role
export const hasRole = (role) => {
    const userRole = getUserRole();
    return userRole === role;
};

// Check if user is admin
export const isAdmin = () => {
    return hasRole('admin');
};

// Check if user is doctor
export const isDoctor = () => {
    return hasRole('doctor');
};

// Check if user is patient
export const isPatient = () => {
    return hasRole('patient');
};

// Logout user
export const logout = () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('email');
    localStorage.removeItem('name');
    localStorage.removeItem('phone');
    localStorage.removeItem('role');

    sessionStorage.removeItem('auth-token');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('name');
    sessionStorage.removeItem('phone');
    sessionStorage.removeItem('role');
};

// Set user authentication data
export const setAuthData = (authData) => {
    if (authData.authtoken) {
        localStorage.setItem('auth-token', authData.authtoken);
        sessionStorage.setItem('auth-token', authData.authtoken);
    }

    if (authData.user) {
        localStorage.setItem('email', authData.user.email);
        localStorage.setItem('name', authData.user.name);
        localStorage.setItem('phone', authData.user.phone);
        localStorage.setItem('role', authData.user.role);

        sessionStorage.setItem('email', authData.user.email);
        sessionStorage.setItem('name', authData.user.name);
        sessionStorage.setItem('phone', authData.user.phone);
        sessionStorage.setItem('role', authData.user.role);
    }
};

// Create headers for authenticated requests
export const getAuthHeaders = () => {
    const token = getAuthToken();
    const email = localStorage.getItem('email') || sessionStorage.getItem('email');

    return {
        'Content-Type': 'application/json',
        'auth-token': token,
        'email': email
    };
};

// Make authenticated API request
export const authFetch = async (url, options = {}) => {
    const defaultOptions = {
        headers: getAuthHeaders(),
        ...options
    };

    if (options.headers) {
        defaultOptions.headers = {
            ...defaultOptions.headers,
            ...options.headers
        };
    }

    try {
        const response = await fetch(url, defaultOptions);
        const data = await response.json();

        if (response.status === 401 && data.error &&
            (data.error.includes('expired') || data.error.includes('invalid'))) {
            logout();
            window.location.href = '/login';
            return null;
        }

        return { response, data };
    } catch (error) {
        console.error('Auth fetch error:', error);
        throw error;
    }
};

// Validate token with server
export const validateToken = async () => {
    const token = getAuthToken();
    if (!token) return false;

    try {
        const response = await fetch('/api/auth/verify-token', {
            headers: {
                'auth-token': token
            }
        });

        const data = await response.json();
        return data.success;
    } catch (error) {
        console.error('Token validation error:', error);
        return false;
    }
};
