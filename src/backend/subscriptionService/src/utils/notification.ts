import sendEmail from "notification-service"
import { Channel } from "rabbitmq"

const sendSubscriberEmail = async (channel: Channel, {email, subject, message}:{email: string, subject: string, message: string}) => {
    
    return await sendEmail(
        channel,
        {
            to: email,
            subject,
            message
        },
        async (_content) => {
            // Handle notification-service response 
        }
    )
}

export default sendSubscriberEmail;