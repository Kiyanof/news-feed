const RABBIT_CONFIG = {
    PROTOCOL: process.env.BROKER_PROTOCOL || 'amqp',
    HOST: process.env.BROKER_HOST || 'localhost',
    PORT: process.env.BROKER_PORT || 5672,
    
    DEFAULT_VHOST: {
        NAME: process.env.BROKER_DEFAULT_VHOST || 'subscriptionVhost',
        CREDENTIAL: {
            USERNAME: process.env.BROKER_DEFAULT_USERNAME ||'guest',
            PASSWORD: process.env.BROKER_DEFAULT_PASSWORD || 'guest'
        }
    }
}

export default RABBIT_CONFIG;