import {Channel, createProducer} from 'rabbitmq'

const readNewsProducer = async (channel: Channel, content: string, callback?: (content: Object) => Promise<any>) => {
    const producer = createProducer({
        proceduerName: 'news/readNews',
        defaultQueue: 'readNews'
    })

    return producer(channel, content, callback)
}

export default readNewsProducer