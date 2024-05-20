/**
 * Interface for Redis configuration
 * @interface RedisConfig
 * @description Interface for Redis configuration.
 * @property {string} PROTOCOL - The protocol used to connect to the Redis server.
 * @property {string} HOST - The host of the Redis server.
 * @property {string} PORT - The port of the Redis server.
 * @property {string} DB - The database number to connect to.
 * @property {string} USER - The username to authenticate with.
 * @property {string} PASSWORD - The password to authenticate with.
 */
export interface RedisConfig {
    PROTOCOL: string;
    HOST: string;
    PORT: string;
    DB: string;
    USER: string;
    PASSWORD: string;
}