import { addSubscriberProducer } from "subscription-service"
import Rabbit, { Channel } from "rabbitmq"
import logger from "../config/logger"
import { RABBIT_URL } from "../config/rabbit.config"
import { Frequency } from "../model/user"

interface Response {
    state: boolean,
    msg: string,
    body: {
        result: string | null
    }
}

/**
 * Add a subscriber.
 * @async
 * @param {Channel} channel - The RabbitMQ channel.
 * @param {Object} subscriber - The subscriber to add.
 * @param {string} subscriber.email - The email of the subscriber.
 * @param {Frequency} subscriber.frequency - The frequency of the subscription.
 * @param {string} subscriber.prompt - The prompt for the subscription.
 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating whether the subscriber was added successfully.
 */
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

/**
 * Add a subscriber to the subscription service.
 * @async
 * @param {string} email - The email of the subscriber.
 * @param {Frequency} frequency - The frequency of the subscription.
 * @param {string} prompt - The prompt for the subscription.
 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating whether the subscriber was added to the subscription service successfully.
 */
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