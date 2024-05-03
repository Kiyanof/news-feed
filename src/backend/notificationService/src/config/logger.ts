import createLogger from 'logger'

const logLevel = process.env.LOG_LEVEL || 'info'
const logDir = process.env.LOG_DIR || 'logs'

const logger = createLogger(
    'notification-service',
    logLevel,
    logDir
)

export default logger