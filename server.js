require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/db/db');

// Connect to MongoDB
connectDB();

// Export for Vercel serverless
module.exports = app;

// Local development only - won't run on Vercel
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
}