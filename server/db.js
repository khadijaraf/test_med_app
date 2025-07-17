const mongoose = require('mongoose');

// Fix the deprecation warning
mongoose.set('strictQuery', false);

// MongoDB connection URI - matches your exact configuration
const mongoURI = "mongodb://root:QFvEjCwVa7WRrqSmyFJQYFUw@172.21.243.24";

const connectToMongo = async (retryCount) => {
    const MAX_RETRIES = 3;
    const count = retryCount ?? 0;
    try {
        await mongoose.connect(mongoURI, { 
            dbName: 'stayhealthybeta1',
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.info('Connected to Mongo Successfully');
        return;
    } catch (error) {
        console.error(error);

        const nextRetryCount = count + 1;

        if (nextRetryCount >= MAX_RETRIES) {
            throw new Error('Unable to connect to Mongo!');
        }

        console.info(`Retrying, retry count: ${nextRetryCount}`);
        return await connectToMongo(nextRetryCount);
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