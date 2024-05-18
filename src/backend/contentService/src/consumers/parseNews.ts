import { createConsumer } from "rabbitmq"
import Ai from "../utils/ai"
import OPENAI_CONFIG from "../config/openai.config";

const summarizeArticles = async (props: {content: Array<string>, keywords: string}) => {
    const ai = new Ai(OPENAI_CONFIG.API_KEY)
    return await ai.summarizeArticles(props)
}

const parsePromptConsumer = createConsumer({
    procedureName: "content/parseNews",
    defaultQueue: "parseNews",
    callback: summarizeArticles
})

export default parsePromptConsumer;