import { getKeywordsProducer } from "subscription-service"
import { Channel } from "rabbitmq"

interface Response {
    state: boolean,
    msg: string,
    body: {
        result: string | null
    }
}

const readAllKeywords = async (channel: Channel, content:{}): Promise<{result: Array<string> | null}> => {
    const result = await getKeywordsProducer(channel, content, (response) => {
        return new Promise((resolve, _reject) => {
            if(response){
                resolve((response as Response).body.result)
            } else {
                resolve(null)
            }
        })
    }) as {result: Array<string> | null}
    return result
}

export default readAllKeywords