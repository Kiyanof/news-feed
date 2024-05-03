import Rabbitmq, { Channel } from "rabbitmq"
import sendEmail from "../../mail/sendEmail";

interface IFeed {
  to: string;
  subject: string;
  message: string;
}

const emailSender = (channel: Channel) => {
  const queue = "emailSender";
  const prefetchCount = 5;
  Rabbitmq.initQueue(channel, queue, prefetchCount);

  channel.consume(queue, async (msg) => {
    if (msg) {
        try {
          const feed = JSON.parse(msg.content.toString()) as IFeed
          const isSent = await sendEmail(feed.to, feed.subject, feed.message) 

          if (isSent) {
            Rabbitmq.handleSuccess(channel, msg, `Notification sent successfully to user`, '')
          }
          else {
            Rabbitmq.handleError(channel, msg, `Notification sent failed to user`, '')
          }
        } catch (error) {
          Rabbitmq.handleError(channel, msg, `Notification sent failed to user`, error)
        }
    }
  });
};

export default emailSender;
