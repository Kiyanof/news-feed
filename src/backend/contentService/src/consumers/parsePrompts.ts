import { createConsumer } from "rabbitmq"
import Ai from "../utils/ai"
const parsePromptConsumer = createConsumer({
    procedureName: "parsePrompts",
    defaultQueue: "content/parsePrompts",
    callback: new Ai().getKeywords
})

export default parsePromptConsumer;