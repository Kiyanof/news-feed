import { RabbitConfig } from '../../index';

/**
 * @constant
 * @description Default configuration for RabbitMQ connection.
 * @default
 * @example
 * {
 *   PROTOCOL: 'amqp',
 *   HOST: 'localhost',
 *   PORT: 5672,
 *   DEFAULT_VHOST: {
 *   NAME: 'notificationVhost',
 *   CREDENTIAL: {
 *   USERNAME: 'guest',
 *   PASSWORD: 'guest'
 *  }
 * }
 */
const DEFAULT_RABBIT_CONFIG: RabbitConfig = {
    PROTOCOL: 'amqp',
    HOST: 'localhost',
    PORT: 5672,
    DEFAULT_VHOST: {
        NAME: 'notificationVhost',
        CREDENTIAL: {
            USERNAME: 'guest',
            PASSWORD: 'guest'
        }
    }
}

/**
 * @constant
 * @description Configuration for RabbitMQ connection, with environment variables overriding defaults.
 */
const RABBIT_CONFIG: RabbitConfig = {
    PROTOCOL: process.env.BROKER_PROTOCOL || DEFAULT_RABBIT_CONFIG.PROTOCOL,
    HOST: process.env.BROKER_HOST || DEFAULT_RABBIT_CONFIG.HOST,
    PORT: +(process.env.BROKER_PORT || DEFAULT_RABBIT_CONFIG.PORT),
    DEFAULT_VHOST: {
        NAME: process.env.BROKER_DEFAULT_VHOST || DEFAULT_RABBIT_CONFIG.DEFAULT_VHOST.NAME,
        CREDENTIAL: {
            USERNAME: process.env.BROKER_DEFAULT_USERNAME || DEFAULT_RABBIT_CONFIG.DEFAULT_VHOST.CREDENTIAL.USERNAME,
            PASSWORD: process.env.BROKER_DEFAULT_PASSWORD || DEFAULT_RABBIT_CONFIG.DEFAULT_VHOST.CREDENTIAL.PASSWORD
        }
    }
}

/**
 * @constant
 * @type {string}
 * @description URI for RabbitMQ connection, constructed from the RABBIT_CONFIG object.
 * @example amqp://guest:guest@localhost:5672/notificationVhostnpm
 * @description - This URI is used to connect to the RabbitMQ server.
 * It includes the protocol, username, password, host, port, and virtual host.
 * The virtual host is used to separate different applications or environments on the same RabbitMQ server.
 * The username and password are used to authenticate the connection.
 * The host and port specify the location of the RabbitMQ server.
 * The protocol specifies the protocol used for the connection.
 * The URI is constructed from the RABBIT_CONFIG object, which contains the configuration parameters for the connection.
 */
export const RABBIT_URL: string = `${RABBIT_CONFIG.PROTOCOL}://${RABBIT_CONFIG.DEFAULT_VHOST.CREDENTIAL.USERNAME}:${RABBIT_CONFIG.DEFAULT_VHOST.CREDENTIAL.PASSWORD}@${RABBIT_CONFIG.HOST}:${RABBIT_CONFIG.PORT}/${RABBIT_CONFIG.DEFAULT_VHOST.NAME}`
export default RABBIT_CONFIG;