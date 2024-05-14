import Rabbit from "rabbitmq";
import RABBIT_CONFIG from "../config/rabbit.conf"
import logger from "../config/logger"
import readNewsConsumer from "./readNews";
import readFeedConsumer from "./readFeed";
import embeddingConsumer from "./embedding";

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
    rabbit.addToQueue(readNewsConsumer)
    rabbit.addToQueue(readFeedConsumer)
    rabbit.addToQueue(embeddingConsumer)
  }
};

export default upConsumers;
