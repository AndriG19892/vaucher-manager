const config = {
    port: process.env.PORT || 8080,
    jwtSecret: process.env.JWT_SECRET,
    connectionString: process.env.MONGO_URI,
}

module.exports = config
