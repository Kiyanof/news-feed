import {Token, TokenConfig} from '../../index'

/**
 * Default token configuration.
 * @constant
 * @default
 * {
 *    SECRET: '',
 *    ALGORITHM: 'HS256',
 *    EXPIRES_IN: '1h'
 * }
 * @description The default token configuration includes the secret, algorithm, and expiration time for the token.
 * @todo read default secret from a filesystem that secure by os permission
 */
const DEFAULT_TOKEN: Token = {
    SECRET: '',
    ALGORITHM: 'HS256',
    EXPIRES_IN: '1h'
};

/**
 * Configuration for access and refresh tokens.
 */
const TOKEN_CONFIG: TokenConfig = {
    ACCESS_TOKEN: {
        SECRET: process.env.ACCESS_TOKEN_SECRET || DEFAULT_TOKEN.SECRET,
        ALGORITHM: process.env.ACCESS_TOKEN_ALGORITHM || DEFAULT_TOKEN.ALGORITHM,
        EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN || DEFAULT_TOKEN.EXPIRES_IN
    },
    REFRESH_TOKEN: {
        SECRET: process.env.REFRESH_TOKEN_SECRET || DEFAULT_TOKEN.SECRET,
        ALGORITHM: process.env.REFRESH_TOKEN_ALGORITHM || DEFAULT_TOKEN.ALGORITHM,
        EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d'
    }
};

export default TOKEN_CONFIG;