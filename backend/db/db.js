const mongoose = require('mongoose');

const uri = process.env.DB_AUTHENTICATION;

const dbConnect = async () => {
    try {
        if (!uri) {
            throw new Error('MongoDB URI is not provided');
        }

        await mongoose.connect(uri);
        
        console.log('DB connected successfully');
    } catch (err) {
        console.error('Failed to connect to the database:', err.message);
    }
};

module.exports = dbConnect;
