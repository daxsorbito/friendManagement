module.exports = {
    name: 'API',
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 8080,
    base_url: process.env.BASE_URL || 'http://localhost:8080',
    db: {
        uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/api'
    }
};