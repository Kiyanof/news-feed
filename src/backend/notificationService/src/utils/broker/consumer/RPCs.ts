import Rabbit from "rabbitmq";
import emailSender from "./email";
import RABBIT_CONFIG from "../../../config/rabbit.conf";
/*
 * Consumer configuration
 */
const url =
  RABBIT_CONFIG.PROTOCOL +
  "://" +
  RABBIT_CONFIG.DEFAULT_VHOST.CREDENTIAL.USERNAME +
  "@" +
  RABBIT_CONFIG.DEFAULT_VHOST.CREDENTIAL.PASSWORD +
  RABBIT_CONFIG.HOST +
  ":" +
  RABBIT_CONFIG.PORT +
  "/" +
  RABBIT_CONFIG.DEFAULT_VHOST.NAME;

const upConsumers = async () => {
  const rabbit = Rabbit.new({
    url,
  });

  if (await rabbit.isReady()) {
    rabbit.addToQueue(emailSender);
  }
};

export default upConsumers;
