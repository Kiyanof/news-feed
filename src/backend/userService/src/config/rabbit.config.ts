const RABBIT_CONFIG = {
    PROTOCOL: process.env.BROKER_PROTOCOL || 'amqp',
    HOST: process.env.BROKER_HOST || 'localhost',
    PORT: process.env.BROKER_PORT || 5672,
    
    DEFAULT_VHOST: {
        NAME: process.env.BROKER_DEFAULT_VHOST || 'notificationVhostnpm',
        CREDENTIAL: {
            USERNAME: process.env.BROKER_DEFAULT_USERNAME ||'guest',
            PASSWORD: process.env.BROKER_DEFAULT_PASSWORD || 'guest'
        }
    }
}

export const RABBIT_URL = `${RABBIT_CONFIG.PROTOCOL}://${RABBIT_CONFIG.DEFAULT_VHOST.CREDENTIAL.USERNAME}:${RABBIT_CONFIG.DEFAULT_VHOST.CREDENTIAL.PASSWORD}@${RABBIT_CONFIG.HOST}:${RABBIT_CONFIG.PORT}/${RABBIT_CONFIG.DEFAULT_VHOST.NAME}`
export default RABBIT_CONFIG;