const config = {
    env: process.env.NODE_ENV || "development",
    port: process.env.PORT || 5000,
    jwtSecret: process.env.JWT_SECRET || "abc6-38dj-2ps-22zx",
    mongoUri: process.env.MONGO_URI || "mongodb+srv://mohammed:6cCeEJuWcl9tF9HB@cluster0.xrk9e.mongodb.net/chat-api"
}

module.exports = config;