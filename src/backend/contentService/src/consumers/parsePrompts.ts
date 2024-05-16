import { createConsumer } from "rabbitmq"
import Ai from "../utils/ai"
import OPENAI_CONFIG from "../config/openai.config";


const parsePromptConsumer = createConsumer({
    procedureName: "content/parsePrompt",
    defaultQueue: "parsePrompt",
    callback: new Ai(OPENAI_CONFIG.API_KEY).getKeywords
})

export default parsePromptConsumer;