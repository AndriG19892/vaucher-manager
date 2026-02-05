// config.js
require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET,
    connectionString: process.env.MONGO_URI,
    // Aggiungi questa riga:
    allowedOrigins: process.env.ALLOWED_ORIGINS || 'http://localhost:5173' 
};
