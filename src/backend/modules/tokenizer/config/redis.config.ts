const REDIS_CONFIG = {
    PROTOCOL: process.env.WHITELIST_PROTOCOL || 'redis',
    HOST: process.env.WHITELIST_HOST || 'localhost',
    PORT: process.env.WHITELIST_PORT || '27017',
    DB: process.env.WHITELIST_DB || '1',
    USER: process.env.WHITELIST_USERNAME || 'guest',
    PASSWORD: process.env.WHITELIST_PASSWORD || 'guest',
}

export const REDIS_URI = `${REDIS_CONFIG.PROTOCOL}://${REDIS_CONFIG.HOST}:${REDIS_CONFIG.PORT}/${REDIS_CONFIG.DB}`
export default REDIS_CONFIG;