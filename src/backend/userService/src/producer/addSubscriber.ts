import { addSubscriberProducer } from "subscription-service"
import Rabbit, { Channel } from "rabbitmq"
import logger from "../config/logger"
import { RABBIT_URL } from "../config/rabbit.config"

interface Response {
    state: boolean,
    msg: string,
    body: {
        result: string | null
    }
}

enum Frequency {
    DAILY = "daily",
    WEEKLY = "weekly",
    MONTHLY = "monthly"
}

const addSubsciber = async (channel: Channel, subscriber:{email: string, frequency: Frequency, prompt: string}): Promise<boolean> => {
    const result = await addSubscriberProducer(channel, subscriber, (response) => {
        return new Promise((resolve, _reject) => {
            if(response){
                resolve((response as Response).body.result)
            } else {
                resolve(null)
            }
        })
    }) as boolean
    return result
}

const addSubsciberToSubscriptionService = async (email: string, frequency: Frequency, prompt: string): Promise<boolean> => {
    try {
        logger.debug(`Change subscriber to subscription service...`)
    const rabbit = Rabbit.new({
      url: RABBIT_URL
    })

    if(!await rabbit.isReady()) {throw new Error("RabbitMQ not ready!")}
    logger.info(`RabbitMQ ready: ${rabbit}`)
    logger.debug(`Change subscriber to subscription service...`)
    const addedToSubscription =  await rabbit.callProcedure(addSubsciber, {email, frequency, prompt})
    if (!addedToSubscription) {throw new Error("Failed to change subscriber to subscription service")}
    logger.info(`Change added to subscription service: ${addedToSubscription}`)
    return true
    } catch (error) {
        logger.error(`Error changing subscriber: ${error}`)
        return false
    }
}

export default addSubsciberToSubscriptionService