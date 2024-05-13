const MONGO_CONFIG = {
    PROTOCOL: process.env.MONGO_PROTOCOL || 'mongodb',
    HOST: process.env.MONGO_HOST || 'localhost',
    PORT: process.env.MONGO_PORT || '27017',
    DB: process.env.MONGO_DB || 'newsfeed',
    USER: process.env.MONGO_USERNAME || 'guest',
    PASSWORD: process.env.MONGO_PASSWORD || 'guest',

    NEWS_EXPIRE: process.env.NEWS_EXPIRE || 60 * 60 * 24 * 30, // 30 days
}

export const MONGO_URI = `${MONGO_CONFIG.PROTOCOL}://${MONGO_CONFIG.HOST}:${MONGO_CONFIG.PORT}/${MONGO_CONFIG.DB}`
export default MONGO_CONFIG;