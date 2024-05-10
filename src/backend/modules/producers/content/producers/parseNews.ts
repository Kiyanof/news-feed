import {Channel, createProducer} from 'rabbitmq'

const parseNewsProducer = async (channel: Channel, content: string, callback?: (content: Object) => Promise<any>) => {
    const producer = createProducer({
        proceduerName: 'content/parseNews',
        defaultQueue: 'parseNews'
    })

    return producer(channel, content, callback)
}

export default parseNewsProducer