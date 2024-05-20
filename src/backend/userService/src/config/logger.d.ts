/**
 * Logger configuration
 * @interface LoggerConfig
 * @description Interface for logger configuration.
 * @property {string} LEVEL - The log level to use.
 * @property {string} DIR - The directory to store the logs in.
 * @example
 * const LOGGER_CONFIG = {
 *    LEVEL: 'info',
 *    DIR: 'logs'
 * }
 */
export interface LoggerConfig {
    LEVEL: string;
    DIR: string;
}
