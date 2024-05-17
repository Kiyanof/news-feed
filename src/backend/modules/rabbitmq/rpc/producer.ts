import { Channel } from "amqplib";
import logger from "../config/logger";
import { randomUUID } from "crypto";

export interface ProducerType {
  proceduerName: string;
  defaultQueue: string;
}

const createProducer = ({ ...props }: ProducerType) => {
  return async (
    channel: Channel,
    produceElement: any,
    callback?: (content: Object) => Promise<any>
  ) => {
    return new Promise((resolve, reject) => {
      logger.defaultMeta = { Procedure: props.proceduerName };
      logger.info(`Sending ${props.proceduerName}...`);

      const params = {
        defaultQueue: props.defaultQueue,
        replyQueue: "",
        correlationID: randomUUID(), // TODO: Create a random generator
      };

      logger.debug("Asserting the queue...");
      channel.assertQueue(params.replyQueue, { exclusive: true }).then((q) => {
        logger.debug(`Queue asserted successfully: ${q.queue}`);

      channel
        .consume(
          q.queue,
          async (msg: any) => {
            logger.debug("Consuming the message...");
            if (msg) {
              if (msg.properties.correlationId === params.correlationID) {
                const content = msg.content.toString();
                logger.info(`Message received: ${content}`);

                callback
                  ? resolve(await callback(JSON.parse(content)))
                  : resolve(true);

                setTimeout(() => {
                  logger.debug(`closing the queue...`);
                  channel.deleteQueue(q.queue)
                  logger.info(`queue closed successfully`);
                }, 1000);
              }
            }
          },
          { noAck: true }
        )
        .catch((error) => {
          logger.error(`Error consuming the message: ${error}`);
          reject(error);
        });

      logger.debug(`Sending ${props.proceduerName} to the queue...`);
      channel.sendToQueue(
        params.defaultQueue,
        Buffer.from(JSON.stringify(produceElement)),
        {
          correlationId: params.correlationID,
          replyTo: q.queue,
        }
      );
      logger.info(`${props.proceduerName} sent successfully`);
      })
      
    });
  };
};

export default createProducer;
