import {Channel, createProducer} from 'rabbitmq'

const parseNewsProducer = async (channel: Channel, content: {content: Array<string>, keywords: string}, callback?: (content: Object) => Promise<any>) => {
    const producer = createProducer({
        proceduerName: 'content/parseNews',
        defaultQueue: 'parseNews'
    })

    return producer(channel, content, callback)
}

export default parseNewsProducer