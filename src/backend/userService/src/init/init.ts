import mongoose from "mongoose";
import logger from "../config/logger";
import { MONGO_URI } from "../config/mongo.config";

/**
 * Initialize MongoDB connection events.
 */
const initMongoEvents = () => {
  mongoose.connection.on("connected", () =>
    logger.info("DB Connection established")
  );
  mongoose.connection.on("reconnect", () =>
    logger.info("DB Connection reconnected")
  );
  mongoose.connection.on("disconnected", () =>
    logger.info("DB Connection disconnected")
  );
  mongoose.connection.on("error", (error) =>
    logger.error("DB Connection error", error.message)
  );
};

/**
 * Initialize MongoDB connection.
 * @async
 * @return {Promise<mongoose.Connection | null>} The mongoose connection object if successful, null otherwise.
 */
const mongoInit = async () => {
  logger.info("Initializing MongoDB...");
  try {
    initMongoEvents();
    logger.debug(`MONGO_URI: ${MONGO_URI}`);
    const connection = await mongoose.connect(MONGO_URI);
    logger.debug(`Connection: ${connection}`);
    if (connection) {
      logger.info("MongoDB initialized");
    }
    return connection;
  } catch (error) {
    logger.error(`Error initializing MongoDB: ${error}`);
    return null;
  }
};

/**
 * Handle system signals for graceful shutdown.
 */
const handleSignals = () => {
  ["SIGINT", "SIGTERM", "SIGQUIT"].forEach((signal) =>
    process.on(signal, () => {
      logger.error("Force signal received...", signal);
      mongoose.connection.close(true);
      process.exit();
    })
  );
};

/**
 * Initialize the application.
 * @async
 */
const appInit = async () => {
  logger.defaultMeta = { label: "init " };
  logger.info("Initializing...");
  await mongoInit();

  handleSignals();
};

export { };
export default appInit;
