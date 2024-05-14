import {Channel, createProducer} from 'rabbitmq'

const readNewsProducer = async (channel: Channel, {newsID}: {newsID: Array<string>}, callback?: (content: Object) => Promise<any>) => {
    const producer = createProducer({
        proceduerName: 'news/readNews',
        defaultQueue: 'readNews'
    })

    return producer(channel, newsID, callback)
}

export default readNewsProducer