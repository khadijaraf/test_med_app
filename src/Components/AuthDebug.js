import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { 
    isAuthenticated, 
    getUserData, 
    getUserRole, 
    logout, 
    authFetch,
    getAuthHeaders
} from '../utils/authUtils';

const AuthDebug = () => {
    const [authStatus, setAuthStatus] = useState({});
    const [testResults, setTestResults] = useState({});
    const [loading, setLoading] = useState(false);

    // Check authentication status
    const checkAuthStatus = () => {
        const userData = getUserData();
        const authenticated = isAuthenticated();
        const role = getUserRole();
        
        setAuthStatus({
            authenticated,
            userData,
            role,
            token: userData?.token?.substring(0, 20) + '...' || 'None'
        });
    };

    // Test login with sample user
    const testLogin = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: 'test@example.com',
                    password: 'password123'
                })
            });

            const data = await response.json();
            setTestResults(prev => ({
                ...prev,
                login: {
                    success: data.success,
                    message: data.message || data.error,
                    user: data.user || null
                }
            }));
        } catch (error) {
            setTestResults(prev => ({
                ...prev,
                login: {
                    success: false,
                    message: 'Network error: ' + error.message,
                    user: null
                }
            }));
        } finally {
            setLoading(false);
        }
    };

    // Test registration with sample user
    const testRegister = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: 'Test User',
                    email: 'test@example.com',
                    password: 'password123',
                    phone: '1234567890',
                    role: 'patient'
                })
            });

            const data = await response.json();
            setTestResults(prev => ({
                ...prev,
                register: {
                    success: data.success,
                    message: data.message || data.error,
                    user: data.user || null
                }
            }));
        } catch (error) {
            setTestResults(prev => ({
                ...prev,
                register: {
                    success: false,
                    message: 'Network error: ' + error.message,
                    user: null
                }
            }));
        } finally {
            setLoading(false);
        }
    };

    // Test profile fetch
    const testProfile = async () => {
        setLoading(true);
        try {
            const { response, data } = await authFetch(`${API_URL}/api/auth/user`);
            setTestResults(prev => ({
                ...prev,
                profile: {
                    success: data.success,
                    message: data.message || data.error,
                    user: data.user || null
                }
            }));
        } catch (error) {
            setTestResults(prev => ({
                ...prev,
                profile: {
                    success: false,
                    message: 'Network error: ' + error.message,
                    user: null
                }
            }));
        } finally {
            setLoading(false);
        }
    };

    // Test server connection
    const testConnection = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/`);
            const data = await response.text();
            setTestResults(prev => ({
                ...prev,
                connection: {
                    success: response.ok,
                    message: data,
                    status: response.status
                }
            }));
        } catch (error) {
            setTestResults(prev => ({
                ...prev,
                connection: {
                    success: false,
                    message: 'Connection failed: ' + error.message,
                    status: 'Error'
                }
            }));
        } finally {
            setLoading(false);
        }
    };

    // Handle logout
    const handleLogout = () => {
        logout();
        checkAuthStatus();
        setTestResults({});
    };

    // Check auth status on component mount
    useEffect(() => {
        checkAuthStatus();
    }, []);

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2>🔍 Authentication Debug Panel</h2>
            
            {/* Authentication Status */}
            <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <h3>📊 Authentication Status</h3>
                <p><strong>Authenticated:</strong> {authStatus.authenticated ? '✅ Yes' : '❌ No'}</p>
                <p><strong>Role:</strong> {authStatus.role || 'None'}</p>
                <p><strong>Token:</strong> {authStatus.token || 'None'}</p>
                {authStatus.userData && (
                    <div>
                        <p><strong>Name:</strong> {authStatus.userData.name}</p>
                        <p><strong>Email:</strong> {authStatus.userData.email}</p>
                        <p><strong>Phone:</strong> {authStatus.userData.phone}</p>
                    </div>
                )}
                <button 
                    onClick={checkAuthStatus}
                    style={{ 
                        padding: '8px 16px', 
                        backgroundColor: '#007bff', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginTop: '10px'
                    }}
                >
                    🔄 Refresh Status
                </button>
            </div>

            {/* Test Actions */}
            <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <h3>🧪 Test Actions</h3>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button 
                        onClick={testConnection}
                        disabled={loading}
                        style={{ 
                            padding: '8px 16px', 
                            backgroundColor: '#28a745', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        🔗 Test Connection
                    </button>
                    <button 
                        onClick={testRegister}
                        disabled={loading}
                        style={{ 
                            padding: '8px 16px', 
                            backgroundColor: '#17a2b8', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        📝 Test Register
                    </button>
                    <button 
                        onClick={testLogin}
                        disabled={loading}
                        style={{ 
                            padding: '8px 16px', 
                            backgroundColor: '#ffc107', 
                            color: 'black', 
                            border: 'none', 
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        🔑 Test Login
                    </button>
                    <button 
                        onClick={testProfile}
                        disabled={loading || !authStatus.authenticated}
                        style={{ 
                            padding: '8px 16px', 
                            backgroundColor: '#6f42c1', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '4px',
                            cursor: 'pointer',
                            opacity: (!authStatus.authenticated || loading) ? 0.5 : 1
                        }}
                    >
                        👤 Test Profile
                    </button>
                    <button 
                        onClick={handleLogout}
                        disabled={!authStatus.authenticated}
                        style={{ 
                            padding: '8px 16px', 
                            backgroundColor: '#dc3545', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '4px',
                            cursor: 'pointer',
                            opacity: !authStatus.authenticated ? 0.5 : 1
                        }}
                    >
                        🚪 Logout
                    </button>
                </div>
            </div>

            {/* Test Results */}
            <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <h3>📋 Test Results</h3>
                {loading && <p>⏳ Loading...</p>}
                
                {Object.entries(testResults).map(([test, result]) => (
                    <div key={test} style={{ marginBottom: '10px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                        <strong>{test.charAt(0).toUpperCase() + test.slice(1)}:</strong>
                        <span style={{ color: result.success ? 'green' : 'red', marginLeft: '10px' }}>
                            {result.success ? '✅ Success' : '❌ Failed'}
                        </span>
                        <p style={{ margin: '5px 0' }}>{result.message}</p>
                        {result.user && (
                            <pre style={{ fontSize: '12px', backgroundColor: '#e9ecef', padding: '5px', borderRadius: '4px' }}>
                                {JSON.stringify(result.user, null, 2)}
                            </pre>
                        )}
                    </div>
                ))}
            </div>

            {/* Debug Info */}
            <div style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <h3>🔧 Debug Info</h3>
                <p><strong>API URL:</strong> {API_URL}</p>
                <p><strong>Headers:</strong></p>
                <pre style={{ fontSize: '12px', backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '4px' }}>
                    {JSON.stringify(getAuthHeaders(), null, 2)}
                </pre>
                <p><strong>Local Storage:</strong></p>
                <pre style={{ fontSize: '12px', backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '4px' }}>
                    {JSON.stringify({
                        'auth-token': localStorage.getItem('auth-token')?.substring(0, 20) + '...' || 'None',
                        'email': localStorage.getItem('email') || 'None',
                        'name': localStorage.getItem('name') || 'None',
                        'role': localStorage.getItem('role') || 'None'
                    }, null, 2)}
                </pre>
            </div>
        </div>
    );
};

export default AuthDebug;