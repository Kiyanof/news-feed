import { RedisConfig } from '../../index';

/**
 * Default Redis configuration.
 * @default
 */
const REDIS_DEFAULT: RedisConfig = {
    PROTOCOL: 'redis',
    HOST: 'localhost',
    PORT: '6379',
    DB: '0',
    USER: '',
    PASSWORD: '',
}

/**
 * Redis configuration.
 * @description Configuration for Redis connection, with environment variables overriding defaults.
 * @default REDIS_DEFAULT
 * @constant
 * @type {RedisConfig}
 * @example
 * const REDIS_CONFIG = {
 *    PROTOCOL: 'redis',
 *    HOST: 'localhost',
 *    PORT: '6379',
 *    DB: '0',
 *    USER: '',
 *    PASSWORD: '',
 * }
 */
const REDIS_CONFIG: RedisConfig = {
    PROTOCOL: process.env.REDIS_PROTOCOL || REDIS_DEFAULT.PROTOCOL,
    HOST: process.env.REDIS_HOST || REDIS_DEFAULT.HOST,
    PORT: process.env.REDIS_PORT || REDIS_DEFAULT.PORT,
    DB: process.env.REDIS_DB || REDIS_DEFAULT.DB,
    USER: process.env.REDIS_USER || REDIS_DEFAULT.USER,
    PASSWORD: process.env.REDIS_PASSWORD || REDIS_DEFAULT.PASSWORD,
}

/**
 * @constant
 * @type {string}
 * @description URI for Redis connection, constructed from the REDIS_CONFIG object.
 * @example
 * redis://localhost:6379/0
 */
export const REDIS_URI: string = `${REDIS_CONFIG.PROTOCOL}://${REDIS_CONFIG.HOST}:${REDIS_CONFIG.PORT}/${REDIS_CONFIG.DB}`

export default REDIS_CONFIG;