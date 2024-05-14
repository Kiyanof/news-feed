import { findRelevantsProducer, readNewsProducer, embeddingProducer } from "news-service";
import { Channel } from "rabbitmq";
import { Frequency } from "./subscriber";

interface IResult {
    summery: string;
    relevanceNews: Array<string>;
}

const findSubscriberNews = async (channel: Channel, {parsedPrompt, frequency}:{parsedPrompt: string, frequency: Frequency}): Promise<IResult | null> => {
    try {
        const result = await findRelevantsProducer(channel, { parsedPrompt, frequency }, async (_content) => {
            return _content
        })
        return result as IResult
    } catch (error) {
        return null
    }

}

interface INews {
    title: string,
    description: string,
    content: string,
    author: string,
    category: string,
    publishedAt: Date
}

interface IResponse {
    state: boolean,
    msg: string,
    body: any
}

const readTheseNews = async (channel: Channel, newsID: Array<string>): Promise<Array<INews>> => {
    return await readNewsProducer(channel, {newsID}, (response) => {
        return new Promise((resolve, _reject) => {
            if(response){
                resolve((response as IResponse).body.news)
            } else {
                resolve([])
            }
        })
    }) as Array<INews>
}

const embedding = async (channel: Channel, parsedPrompt: string): Promise<Float32Array | null> => {
    return await embeddingProducer(channel, {parsedPrompt}, (response) => {
        return new Promise((resolve, _reject) => {
            if(response){
                resolve((response as IResponse).body.result)
            } else {
                resolve(null)
            }
        })
    }) as Float32Array | null
}



export {
    findSubscriberNews,
    readTheseNews,
    embedding
};