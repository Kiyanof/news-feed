import {Channel, createProducer} from 'rabbitmq'

const parsePromptProducer = async (channel: Channel, content: {content: string}, callback?: (content: Object) => Promise<any>) => {
    const producer = createProducer({
        proceduerName: 'content/parsePrompt',
        defaultQueue: 'parsePrompt'
    })

    return producer(channel, content, callback)
}

export default parsePromptProducer