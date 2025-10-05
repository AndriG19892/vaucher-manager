const config = {
    port: process.env.PORT || 8080,
    jwtSecret: process.env.JWT_SECRET,
    connectionString: process.env.CONNECTION_STRING_DB,
}

module.exports = config