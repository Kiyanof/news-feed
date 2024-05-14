import { addSubscriberProducer } from "subscription-service"
import { Channel } from "rabbitmq"

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

export default addSubsciber