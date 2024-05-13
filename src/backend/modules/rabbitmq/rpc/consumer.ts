import { Channel } from "amqplib";
import Rabbitmq from "../index";

export interface ConsumerType {
  procedureName: string;
  defaultQueue: string;
  prefetch?: number;
  callback: (props: any) => Promise<any>;
}

const createConsumer = ({ ...props }: ConsumerType) => {
  return (channel: Channel): void => {
    const queue = props.defaultQueue;
    const prefetchCount = props.prefetch || 1;

    Rabbitmq.initQueue(channel, queue, prefetchCount);

    channel.consume(queue, async (msg) => {
      if (msg) {
        try {
          const content = JSON.parse(msg.content.toString());
          const isSuccessful = await props.callback(JSON.parse(content));

          if (isSuccessful) {
            Rabbitmq.handleSuccess(
              channel,
              msg,
              `${props.procedureName} replied successfully to user`,
              isSuccessful
            );
          } else {
            Rabbitmq.handleError(
              channel,
              msg,
              `${props.procedureName} replied failed to user`,
              ""
            );
          }
        } catch (error) {
          Rabbitmq.handleError(
            channel,
            msg,
            `${props.procedureName} sent failed to user`,
            error
          );
        }
      }
    });
  };
};

export default createConsumer;
