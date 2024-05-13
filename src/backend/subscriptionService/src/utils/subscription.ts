import { parsePromptProducer } from "content-service"
import { readNewsProducer } from "news-service"

import { Channel } from "rabbitmq"

type Response = {result: string | null}

const parsePrompt = async (channel: Channel, content: string): Promise<string | null> => {
    let result = null 
    await parsePromptProducer(channel, content, (response) => {
        return new Promise((resolve, _reject) => {
            if(response){
                result = (response as Response).result
                resolve(result)
            } else {
                resolve(null)
            }
        })
    })
    return result
}

interface INews {
    title: string,
    description: string,
    content: string,
    author: string,
    publishedAt: Date,
}

interface IResult {
    results: Array<INews>
}

const readNews = async (channel: Channel, {ids}: {ids?: Array<string>}): Promise<IResult | null> => {
    let result = null 
    await readNewsProducer(channel, ids?.toString() ?? '', (result) => {
        return new Promise((resolve, _reject) => {
            if(result){
                result = result as IResult
                resolve(result)
            } else {
                resolve(null)
            }
        })
    })
    return result
}

export {
    parsePrompt,
    readNews
}