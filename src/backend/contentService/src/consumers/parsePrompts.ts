import { createConsumer } from "rabbitmq"
import Ai from "../utils/ai"
const parsePromptConsumer = createConsumer({
    procedureName: "content/parsePrompt",
    defaultQueue: "parsePrompt",
    callback: new Ai().getKeywords
})

export default parsePromptConsumer;