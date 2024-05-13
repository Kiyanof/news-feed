import {Channel, createProducer} from 'rabbitmq'

const getKeywordsProducer = async (channel: Channel, content: string, callback?: (content: Object) => Promise<any>) => {
    const producer = createProducer({
        proceduerName: 'news/getKeywords',
        defaultQueue: 'getKeywords'
    })

    return producer(channel, content, callback)
}

export default getKeywordsProducer