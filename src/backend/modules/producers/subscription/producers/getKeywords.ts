import {Channel, createProducer} from 'rabbitmq'

const getKeywordsProducer = async (channel: Channel, content: {}, callback?: (content: Object) => Promise<any>) => {
    const producer = createProducer({
        proceduerName: 'subscription/readKeywords',
        defaultQueue: 'readKeywords'
    })

    return producer(channel, content, callback)
}

export default getKeywordsProducer