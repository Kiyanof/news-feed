import mongoose from 'mongoose'

enum Frequency {
    DAILY = 'daily',
    WEEKLY = 'weekly',
    MONTHLY = 'monthly'
}

interface ISubscriber {
    email: string,
    frequency: Frequency,
    prompt: string,
    parsedPrompt: string,
    embeddingParsedPrompt: string,
    lastNewsSummerized: string,
    lastRelatedNewsIDs: Array<string>,
    updatedAt: Date,
    createdAt: Date,

    shouldUpdate(): boolean,
}

const SubscriberSchema = new mongoose.Schema<ISubscriber>({
    email: { type: String, required: true },
    frequency: { type: String, required: true },
    prompt: { type: String, required: true },
    parsedPrompt: { type: String, required: true },
    embeddingParsedPrompt: { type: String, required: true },
    lastNewsSummerized: { type: String, required: false, default: ''},
    lastRelatedNewsIDs: { type: [String], required: false , default: []},
    updatedAt: { type: Date, required: false, default: Date.now },
    createdAt: { type: Date, required: false, default: Date.now }
})

SubscriberSchema.methods.shouldUpdate = function(this: ISubscriber): boolean {
    const now = new Date()
    const diff = now.getTime() - this.updatedAt.getTime()
    switch(this.frequency){
        case Frequency.DAILY:
            return diff >= 86400000
        case Frequency.WEEKLY:
            return diff >= 604800000
        case Frequency.MONTHLY:
            return diff >= 2592000000
        default:
            return false
    }
}

const SubscriberModel = mongoose.model<ISubscriber>('Subscriber', SubscriberSchema)
export default SubscriberModel