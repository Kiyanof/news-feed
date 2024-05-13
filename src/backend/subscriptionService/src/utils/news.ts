import { findRelevantsProducer } from "content-service";
import { Channel } from "rabbitmq";
import { Frequency } from "./subscriber";

interface IResult {
    summery: string;
    relevanceNews: Array<string>;
}

const findSubscriberNews = async (channel: Channel, {parsedPrompt, frequency}:{parsedPrompt: string, frequency: Frequency}): Promise<IResult | null> => {
    try {
        const result = await findRelevantsProducer(channel, JSON.stringify({ parsedPrompt, frequency }), async (_content) => {
            return _content
        })
        return result as IResult
    } catch (error) {
        return null
    }

}

export default findSubscriberNews;