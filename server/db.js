const mongoose = require('mongoose');
const mongoURI = "mongodb://root:<1uCGbBsyV6sAEVlWUuvSsHma>@172.21.148.105:27017";

const connectToMongo = async (retryCount) => {
    const MAX_RETRIES = 3;
    const count = retryCount ?? 0;
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log("Connected to MongoDB successfully");
        return true;
    } catch (error) {
        console.log(`MongoDB connection failed. Attempt ${count + 1} of ${MAX_RETRIES}`);
        console.error("Error connecting to MongoDB:", error.message);
        
        if (count < MAX_RETRIES - 1) {
            console.log(`Retrying connection in 5 seconds...`);
            await new Promise(resolve => setTimeout(resolve, 5000));
            return connectToMongo(count + 1);
        } else {
            console.error("Max retries reached. Could not connect to MongoDB.");
            process.exit(1);
        }
    }
};

// Handle connection events
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from MongoDB');
});

// Handle application termination
process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed due to application termination');
        process.exit(0);
    } catch (error) {
        console.error('Error closing MongoDB connection:', error);
        process.exit(1);
    }
});

module.exports = connectToMongo;