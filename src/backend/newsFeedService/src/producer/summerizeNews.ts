import { parseNewsProducer } from "content-service"
import { Channel } from "rabbitmq"

interface Response {
    state: boolean,
    msg: string,
    body: {
        result: string | null
    }
}

const summerizeNews = async (channel: Channel, content:{content: Array<string>, keywords: string}): Promise<string | null> => {
    const result = await parseNewsProducer(channel, content, (response) => {
        return new Promise((resolve, _reject) => {
            if(response){
                resolve((response as Response).body.result)
            } else {
                resolve(null)
            }
        })
    }) as string | null
    return result
}

export default summerizeNews