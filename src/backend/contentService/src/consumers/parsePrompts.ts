import { createConsumer } from "rabbitmq"
import Ai from "../utils/ai"
import OPENAI_CONFIG from "../config/openai.config";
import logger from "../config/logger";

const getKeywords = async ({content}:{content: string}) => {
    logger.debug(`processing content for body prompt...: ${content}`)
    const ai = new Ai(OPENAI_CONFIG.API_KEY)
    return await ai.getKeywords({content})
}


const parsePromptConsumer = createConsumer({
    procedureName: "content/parsePrompt",
    defaultQueue: "parsePrompt",
    callback: getKeywords
})

export default parsePromptConsumer;