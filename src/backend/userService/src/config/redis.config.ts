const REDIS_CONFIG = {
    PROTOCOL: process.env.REDIS_PROTOCOL || 'redis',
    HOST: process.env.REDIS_HOST || 'localhost',
    PORT: process.env.REDIS_PORT || '27017',
    DB: process.env.REDIS_DB || '1',
    USER: process.env.REDIS_USERNAME || 'guest',
    PASSWORD: process.env.REDIS_PASSWORD || 'guest',
}

export const REDIS_URI = `${REDIS_CONFIG.PROTOCOL}://${REDIS_CONFIG.HOST}:${REDIS_CONFIG.PORT}/${REDIS_CONFIG.DB}`
export default REDIS_CONFIG;