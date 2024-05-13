import {Channel, createProducer} from 'rabbitmq'

const findRelevantsProducer = async (channel: Channel, content: string, callback?: (content: Object) => Promise<any>) => {
    const producer = createProducer({
        proceduerName: 'news/findRelevants',
        defaultQueue: 'findRelevants'
    })

    return producer(channel, content, callback)
}

export default findRelevantsProducer