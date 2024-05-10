import { randomUUID } from "crypto";
import { logger } from "./config/logger"
import { Channel } from "amqplib"

export interface EmailNotificationType {
    to: string;
    subject: string;
    message: string;
}

const sendEmail = async (channel: Channel, notificationElement: EmailNotificationType, callback?: (content: Object) => void) => {

    return new Promise((resolve, reject) => {
        logger.defaultMeta = { Procedure: 'sendEmail' }
        logger.info('Sending email...')

        const params = {
            defaultQueue: 'email-notification',
            replyQueue: '',
            correlationID: randomUUID(), // TODO: Create a random generator
        }

        logger.debug('Asserting the queue...')
        channel.assertQueue(params.replyQueue, { exclusive: true }).then(async (queue) => {
            logger.debug(`Queue asserted successfully: ${queue.queue}`)
            
            await channel.consume(queue.queue, (msg: any) => {
                logger.debug('Consuming the message...')
                if(msg) {
                    if(msg.properties.correlationId === params.correlationID) {
                        const content = msg.content.toString()
                        logger.info(`Message received: ${content}`)
    
                        callback && callback(content)
                        resolve(true)
    
                        setTimeout(() => {
                            logger.debug(`closing the channel...`)
                            channel.close()
                            logger.info(`Channel closed successfully`)
                        }, 1000);
                    }
                    resolve(false)
                }
                resolve(false)
            }, { noAck: true }).catch((error) => {
                logger.error(`Error consuming the message: ${error}`)
                reject(error)
            })
    
                logger.debug('Sending notification to the queue...')
                channel.sendToQueue(params.defaultQueue, Buffer.from(JSON.stringify(notificationElement)), {
                    correlationId: params.correlationID,
                    replyTo: params.replyQueue
                })
                logger.info('Notification sent successfully')
            })

    })
}

export default sendEmail