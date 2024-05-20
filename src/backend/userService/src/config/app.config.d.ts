declare const DEFAULT_APP_CONFIG: {
    SERVER: {
        PORT: number;
    };
    RATE_LIMIT: {
        API: {
            WINDOW: string;
            MAX_REQUESTS: number;
            MESSAGE: string;
        };
    };
};

declare const APP_CONFIG: {
    SERVER: {
        PORT: number | string;
    };
    RATE_LIMIT: {
        API: {
            WINDOW: any;
            MAX_REQUESTS: number;
            MESSAGE: string;
        };
    };
};

export default APP_CONFIG;