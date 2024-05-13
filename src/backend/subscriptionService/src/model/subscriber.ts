import mongoose from 'mongoose'

enum Frequency {
    daily = 'daily',
    weekly = 'weekly',
    monthly = 'monthly'
}

interface ISubscriber {
    email: string,
    frequency: Frequency,
    prompt: string,
    parsedPrompt: string,
    embeddingParsedPrompt: string,
    lastNewsSummerized: string,
    lastRelatedNewsIDs: Array<string>
}

const SubscriberSchema = new mongoose.Schema<ISubscriber>({
    email: { type: String, required: true },
    frequency: { type: String, required: true },
    prompt: { type: String, required: true },
    parsedPrompt: { type: String, required: true },
    embeddingParsedPrompt: { type: String, required: true },
    lastNewsSummerized: { type: String, required: false, default: ''},
    lastRelatedNewsIDs: { type: [String], required: false , default: []}
})

const SubscriberModel = mongoose.model<ISubscriber>('Subscriber', SubscriberSchema)
export default SubscriberModel