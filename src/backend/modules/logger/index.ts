import winston from "winston";

const createLogger = (
  serviceName: string = "logger-service",
  defaultLevel: string = "info",
  defaultDir: string = "logs"
) => {
  const logLevel = defaultLevel;
  const logDir = defaultDir;

  const format = winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  );

  const logger = winston.createLogger({
    level: logLevel,
    format: format,
    defaultMeta: { service: serviceName },
    transports: [
      new winston.transports.Console({
        level: logLevel,
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        ),
      }),
      new winston.transports.File({
        filename: `${logDir}/error.log`,
        level: "error",
      }),
      new winston.transports.File({ filename: `${logDir}/combined.log` }),
    ],
  });

  return logger;
};

export default createLogger;
