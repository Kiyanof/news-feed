export const API_MAIN_CONF = {
    PROTOCOL: 'http',
    HOST: 'localhost',
    PORT: '8000',
    BASE_PATH: '',
}

export const URLGenerator = (endpoint: string, path: string, PORT: string = API_MAIN_CONF.PORT) => {
    return `${API_MAIN_CONF.PROTOCOL}://${API_MAIN_CONF.HOST}:${PORT}${API_MAIN_CONF.BASE_PATH}${endpoint}${path}`;
}