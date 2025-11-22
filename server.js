require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/db/db');
const mongoose = require('mongoose');

// For Vercel serverless: Connect to MongoDB lazily (on first request)
// This prevents function initialization failures if DB is temporarily unavailable
let connectionPromise = null;

// Lazy connection function - connects on first API call
async function ensureDBConnection() {
    // If already connected, return immediately
    if (mongoose.connection.readyState === 1) {
        return;
    }
    
    // If connection is in progress, wait for it
    if (connectionPromise) {
        await connectionPromise;
        return;
    }
    
    // Start new connection
    connectionPromise = connectDB().catch(err => {
        connectionPromise = null; // Reset on failure so we can retry
        console.error('Failed to connect to MongoDB:', err);
        throw err;
    });
    
    await connectionPromise;
}

// Middleware to ensure DB connection before handling requests
app.use(async (req, res, next) => {
    try {
        await ensureDBConnection();
        next();
    } catch (err) {
        res.status(500).json({ 
            error: 'Database connection failed', 
            message: err.message 
        });
    }
});

// Export for Vercel serverless
module.exports = app;

// Local development only - connect immediately
if (require.main === module) {
    // Connect to MongoDB for local development
    connectDB().then(() => {
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    }).catch((err) => {
        console.error('Failed to start server:', err);
        process.exit(1);
    });
}