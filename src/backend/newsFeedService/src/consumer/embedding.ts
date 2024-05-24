import { createConsumer } from "rabbitmq"
import News from "../lib/News";

const embedding = async ({parsedPrompt}:{parsedPrompt: {parsedPrompt: string}}) => { // TODO: Later, fix this bug 
    return {result: await News.generateStaticEmbedding(parsedPrompt.parsedPrompt, 'query')};
}

const embeddingConsumer = createConsumer({
    procedureName: "news/embedding",
    defaultQueue: "embedding",
    callback: embedding,
})

export default embeddingConsumer;