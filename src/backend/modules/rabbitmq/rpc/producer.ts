import { Channel } from 'amqplib'
import { logger } from '../config/logger'
import { randomUUID } from 'crypto'

export interface ProducerType {
    proceduerName: string,
    defaultQueue: string,
}

const createProducer = ({...props}: ProducerType) => {
    return async (channel: Channel, produceElement: any, callback?: (content: Object) => Promise<any>) => {
        return new Promise((resolve, reject) => {
            logger.defaultMeta = { Procedure: props.proceduerName }
            logger.info(`Sending ${props.proceduerName}...`)
    
            const params = {
                defaultQueue: props.defaultQueue,
                replyQueue: '',
                correlationID: randomUUID(), // TODO: Create a random generator
            }
    
            logger.debug('Asserting the queue...')
            channel.assertQueue(params.replyQueue, { exclusive: true }).then(async (queue) => {
                logger.debug(`Queue asserted successfully: ${queue.queue}`)
                
                await channel.consume(queue.queue, async (msg: any) => {
                    logger.debug('Consuming the message...')
                    if(msg) {
                        if(msg.properties.correlationId === params.correlationID) {
                            const content = msg.content.toString()
                            logger.info(`Message received: ${content}`)
        
                            callback ? resolve(await callback(JSON.parse(content))) : resolve(true)
                            
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
        
                    logger.debug(`Sending ${props.proceduerName} to the queue...`)
                    channel.sendToQueue(params.defaultQueue, Buffer.from(JSON.stringify(produceElement)), {
                        correlationId: params.correlationID,
                        replyTo: params.replyQueue
                    })
                    logger.info(`${props.proceduerName} sent successfully`)
                })
    
        })
    }
}

export default createProducer