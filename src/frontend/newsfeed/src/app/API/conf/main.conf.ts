export const API_MAIN_CONF = {
    PROTOCOL: 'http',
    HOST: 'localhost',
    PORT: '8080',
    BASE_PATH: '/api',
}

export const URLGenerator = (endpoint: string, path: string) => {
    return `${API_MAIN_CONF.PROTOCOL}://${API_MAIN_CONF.HOST}:${API_MAIN_CONF.PORT}${API_MAIN_CONF.BASE_PATH}${endpoint}${path}`;
}