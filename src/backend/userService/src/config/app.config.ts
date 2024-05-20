const DEFAULT_APP_CONFIG = {
    SERVER: {
        PORT: 8000,
    },
    RATE_LIMIT: {
        API: {
            WINDOW: "15 * 60 * 1000",
            MAX_REQUESTS: 100,
            MESSAGE: "Too many requests from this IP, please try again later.",
        },
    },
    ENVIRONMENT: "development"
}

const APP_CONFIG = {
    SERVER: {
        PORT: process.env.APP_PORT || DEFAULT_APP_CONFIG.SERVER.PORT,
    },
    RATE_LIMIT: {
        API: {
            WINDOW: eval(process.env.RATE_LIMIT_API_WINDOW || DEFAULT_APP_CONFIG.RATE_LIMIT.API.WINDOW),
            MAX_REQUESTS: +(process.env.RATE_LIMIT_API_MAX_REQUESTS || DEFAULT_APP_CONFIG.RATE_LIMIT.API.MAX_REQUESTS),
            MESSAGE: process.env.RATE_LIMIT_API_MESSAGE || DEFAULT_APP_CONFIG.RATE_LIMIT.API.MESSAGE,
        },
    },
    ENVIRONMENT: process.env.NODE_ENV || DEFAULT_APP_CONFIG.ENVIRONMENT,
}

export default APP_CONFIG;