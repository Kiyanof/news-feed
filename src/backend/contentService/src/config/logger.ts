import createLogger from 'logger'
import winston from 'winston'

const logLevel = process.env.LOG_LEVEL || 'info'
const logDir = process.env.LOG_DIR || 'logs'

const logger: winston.Logger = createLogger(
    'newsfeed-service',
    logLevel,
    logDir
)

export default logger