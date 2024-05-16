import {Channel, createProducer} from 'rabbitmq'

const embeddingProducer = async (channel: Channel, content:{parsedPrompt: string}, callback?: (content: Object) => Promise<any>) => {
    const producer = createProducer({
        proceduerName: 'news/embedding',
        defaultQueue: 'embedding'
    })

    return producer(channel, content, callback)
}

export default embeddingProducer