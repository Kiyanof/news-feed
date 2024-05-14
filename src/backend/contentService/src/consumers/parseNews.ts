import { createConsumer } from "rabbitmq"
import Ai from "../utils/ai"
const parsePromptConsumer = createConsumer({
    procedureName: "content/parseNews",
    defaultQueue: "parseNews",
    callback: new Ai().summarizeArticles
})

export default parsePromptConsumer;