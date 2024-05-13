const TOKEN_CONFIG = {
    ACCESS_TOKEN: {
        SECRET: process.env.ACCESS_TOKEN_SECRET || '',
        ALGORITHM: process.env.ACCESS_TOKEN_ALGORITHM || 'HS256',
        EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN || '1h'
    },
    REFRESH_TOKEN: {
        SECRET: process.env.REFRESH_TOKEN_SECRET || '',
        ALGORITHM: process.env.REFRESH_TOKEN_ALGORITHM || 'HS256',
        EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d'
    }
}

export default TOKEN_CONFIG;