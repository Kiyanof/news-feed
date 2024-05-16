import {Channel, createProducer} from 'rabbitmq'

const changeSubscriptionProducer = async (channel: Channel, content: string, callback?: (content: Object) => Promise<any>) => {
    const producer = createProducer({
        proceduerName: 'subscription/changeSubscription',
        defaultQueue: 'changeSubscription'
    })

    return producer(channel, content, callback)
}

export default changeSubscriptionProducer