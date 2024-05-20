/**
 * @interface RabbitConfig
 * @description Interface for RabbitMQ configuration.
 */
export interface RabbitConfig {
    PROTOCOL: string;
    HOST: string;
    PORT: number;
    DEFAULT_VHOST: {
        NAME: string;
        CREDENTIAL: {
            USERNAME: string;
            PASSWORD: string;
        };
    };
}