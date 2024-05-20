import createLogger, {Logger} from "logger";
import { LoggerConfig } from "../../index";

/**
 * Default logger configuration.
 * @constant
 * @default
 * @description Default configuration for the logger.
 * @type {LoggerConfig}
 */
const DEFAULT_LOGGER: LoggerConfig = {
    LEVEL: 'info',
    DIR: 'logs'
}

/**
 * Logger configuration.
 * @constant
 * @description Configuration for the logger, with environment variables overriding defaults.
 * @type {LoggerConfig}
 */
const LOGGER_CONFIG: LoggerConfig = {
    LEVEL: process.env.LOG_LEVEL || DEFAULT_LOGGER.LEVEL,
    DIR: process.env.LOG_DIR || DEFAULT_LOGGER.DIR
}

/**
 * @constant
 * @description Logger instance.
 * @type {Logger}
 * @returns {Winstron.Logger}
 * @example
 * const logger = createLogger('user-service', LOGGER_CONFIG.LEVEL, LOGGER_CONFIG.DIR)
 * @description - This creates a new logger instance with the specified name, log level, and log directory.
 * The logger can be used to log messages at different levels, such as info, debug, warn, and error.
 * The log messages are written to log files in the specified directory.
 * The logger can be configured with different log levels and log directories to control the amount of logging and where the logs are stored.
 */
const logger: Logger = createLogger(
    'user-service',
    LOGGER_CONFIG.LEVEL,
    LOGGER_CONFIG.DIR
)

export default logger