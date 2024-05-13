import{ createConsumer } from "rabbitmq"
import sendEmail from "../../mail/sendEmail";

export interface IFeed {
  to: string;
  subject: string;
  message: string;
}

const emailConsumer = createConsumer({
  procedureName: "emailSender",
  defaultQueue: "notification/email",
  callback: sendEmail,
});

export default emailConsumer;
