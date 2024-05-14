import Rabbit from "rabbitmq";
import RABBIT_CONFIG from "../config/rabbit.conf"
import logger from "../config/logger"
import readKeywords from "./readKeywords";
import addSubscriberConsumer from "./addSubscriber";
/*
 * Consumer configuration
 */
const url =
  RABBIT_CONFIG.PROTOCOL +
  "://" +
  RABBIT_CONFIG.DEFAULT_VHOST.CREDENTIAL.USERNAME +
  ":" +
  RABBIT_CONFIG.DEFAULT_VHOST.CREDENTIAL.PASSWORD +
  "@" +
  RABBIT_CONFIG.HOST +
  ":" +
  RABBIT_CONFIG.PORT +
  "/" +
  RABBIT_CONFIG.DEFAULT_VHOST.NAME;

  logger.info(`RabbitMQ URL: ${url}`);

const upConsumers = async () => {
  const rabbit = Rabbit.new({
    url,
  });

  if (await rabbit.isReady()) {
    rabbit.addToQueue(readKeywords)
    rabbit.addToQueue(addSubscriberConsumer)
  }
};

export default upConsumers;
