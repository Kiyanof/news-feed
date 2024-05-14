import upConsumers from "../consumers/RPCs";
import logger from "../config/logger";


const handleSignals = () => {
  ["SIGINT", "SIGTERM", "SIGQUIT"].forEach((signal) =>
    process.on(signal, () => {
      logger.error("Force signal received...", signal);
      process.exit();
    })
  );
};

const appInit = async () => {
  logger.defaultMeta = { label: "init " };
  logger.info("Initializing...");
  await upConsumers
  handleSignals();
};

export { };
export default appInit;
