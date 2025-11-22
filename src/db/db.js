const mongoose = require('mongoose');

// Cache the connection to reuse in serverless environments
let cachedConnection = null;

async function connectDB() {
    // If connection already exists and is ready, reuse it
    if (cachedConnection && mongoose.connection.readyState === 1) {
        return cachedConnection;
    }

    // Get MongoDB URL from environment variable
    const MONGODB_URL = process.env.MONGODB_URL || "mongodb://localhost:27017/food-view";
    
    if (!MONGODB_URL) {
        throw new Error('MONGODB_URL environment variable is not set');
    }

    try {
        // Connect to MongoDB
        const connection = await mongoose.connect(MONGODB_URL, {
            // Connection options for better reliability
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        });
        
        cachedConnection = connection;
        console.log("MongoDB connected successfully");
        return connection;
    } catch (err) {
        console.error("MongoDB connection error:", err);
        // Don't throw in serverless - let it retry on next invocation
        // This prevents the function from failing to initialize
        throw err;
    }
}

module.exports = connectDB;