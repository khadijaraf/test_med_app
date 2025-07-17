const axios = require('axios');

// Configuration
const API_URL = 'http://localhost:8181';

// Test data
const testUsers = [
    {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        phone: '1234567890',
        role: 'patient'
    },
    {
        name: 'Dr. Smith',
        email: 'dr.smith@example.com',
        password: 'password123',
        phone: '9876543210',
        role: 'doctor'
    },
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        phone: '5555555555',
        role: 'admin'
    }
];

// Function to register a user
const registerUser = async (userData) => {
    try {
        console.log(`\n🔄 Testing registration for: ${userData.name} (${userData.role})`);
        
        const response = await axios.post(`${API_URL}/api/auth/register`, userData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.data.success) {
            console.log('✅ Registration successful!');
            console.log('📋 User details:', response.data.user);
            console.log('🔑 Token received:', response.data.authtoken.substring(0, 20) + '...');
            return response.data;
        } else {
            console.log('❌ Registration failed:', response.data.error);
            return null;
        }
    } catch (error) {
        console.log('❌ Registration error:');
        if (error.response) {
            console.log('   Status:', error.response.status);
            console.log('   Error:', error.response.data.error || error.response.data.errors);
        } else {
            console.log('   Network error:', error.message);
        }
        return null;
    }
};

// Function to login a user
const loginUser = async (email, password) => {
    try {
        console.log(`\n🔄 Testing login for: ${email}`);
        
        const response = await axios.post(`${API_URL}/api/auth/login`, {
            email,
            password
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.data.success) {
            console.log('✅ Login successful!');
            console.log('👤 User details:', response.data.user);
            console.log('🔑 Token received:', response.data.authtoken.substring(0, 20) + '...');
            return response.data;
        } else {
            console.log('❌ Login failed:', response.data.error);
            return null;
        }
    } catch (error) {
        console.log('❌ Login error:');
        if (error.response) {
            console.log('   Status:', error.response.status);
            console.log('   Error:', error.response.data.error || error.response.data.errors);
        } else {
            console.log('   Network error:', error.message);
        }
        return null;
    }
};

// Function to get user profile
const getUserProfile = async (email, token) => {
    try {
        console.log(`\n🔄 Testing get profile for: ${email}`);
        
        const response = await axios.get(`${API_URL}/api/auth/user`, {
            headers: {
                'email': email,
                'auth-token': token
            }
        });

        if (response.data.success) {
            console.log('✅ Profile retrieved successfully!');
            console.log('👤 Profile details:', response.data.user);
            return response.data;
        } else {
            console.log('❌ Profile retrieval failed:', response.data.error);
            return null;
        }
    } catch (error) {
        console.log('❌ Profile retrieval error:');
        if (error.response) {
            console.log('   Status:', error.response.status);
            console.log('   Error:', error.response.data.error);
        } else {
            console.log('   Network error:', error.message);
        }
        return null;
    }
};

// Function to test server connection
const testConnection = async () => {
    try {
        console.log('🔄 Testing server connection...');
        const response = await axios.get(`${API_URL}/`);
        console.log('✅ Server is running!');
        console.log('📝 Response:', response.data);
        return true;
    } catch (error) {
        console.log('❌ Server connection failed:');
        console.log('   Error:', error.message);
        return false;
    }
};

// Main test function
const runTests = async () => {
    console.log('🚀 Starting Authentication Tests...');
    console.log('=' * 50);

    // Test server connection
    const isConnected = await testConnection();
    if (!isConnected) {
        console.log('❌ Cannot connect to server. Please make sure the server is running.');
        return;
    }

    // Test registration for each user
    const registeredUsers = [];
    for (const user of testUsers) {
        const result = await registerUser(user);
        if (result) {
            registeredUsers.push({ ...user, token: result.authtoken });
        }
    }

    console.log('\n' + '=' * 50);
    console.log('📊 Registration Summary:');
    console.log(`✅ Successfully registered: ${registeredUsers.length}/${testUsers.length} users`);

    // Test login for registered users
    console.log('\n' + '=' * 50);
    console.log('🔓 Testing Login...');
    
    for (const user of registeredUsers) {
        await loginUser(user.email, user.password);
    }

    // Test profile retrieval
    console.log('\n' + '=' * 50);
    console.log('👤 Testing Profile Retrieval...');
    
    for (const user of registeredUsers) {
        await getUserProfile(user.email, user.token);
    }

    console.log('\n' + '=' * 50);
    console.log('🎉 All tests completed!');
};

// Run tests if this file is executed directly
if (require.main === module) {
    runTests().catch(console.error);
}

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    testConnection,
    runTests
};