import mongoose from "mongoose";
import logger from "../config/logger";
import { MONGO_URI } from "../config/mongo.config";

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

const handleSignals = () => {
  ["SIGINT", "SIGTERM", "SIGQUIT"].forEach((signal) =>
    process.on(signal, () => {
      logger.error("Force signal received...", signal);
      mongoose.connection.close(true);
      process.exit();
    })
  );
};

const appInit = async () => {
  logger.defaultMeta = { label: "init " };
  logger.info("Initializing...");
  await mongoInit();

  handleSignals();
};

export { };
export default appInit;
