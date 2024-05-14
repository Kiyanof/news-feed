import {Channel, createProducer} from 'rabbitmq'
import { Frequency } from 'src/utils/subscriber'

const findRelevantsProducer = async (channel: Channel, content:{parsedPrompt: string, frequency: Frequency}, callback?: (content: Object) => Promise<any>) => {
    const producer = createProducer({
        proceduerName: 'news/findRelevants',
        defaultQueue: 'findRelevants'
    })

    return producer(channel, content, callback)
}

export default findRelevantsProducer