import { Channel, createProducer} from "rabbitmq"
export interface EmailNotificationType {
    to: string;
    subject: string;
    message: string;
}

const sendEmail = async (channel: Channel, notificationElement: EmailNotificationType, callback?: (content: Object) => Promise<any>) => {
    const producer =  createProducer({
        proceduerName: "notification/sendEmail",
        defaultQueue: "sendEmail"
    })

    return await producer(channel, notificationElement, callback)
}

export default sendEmail