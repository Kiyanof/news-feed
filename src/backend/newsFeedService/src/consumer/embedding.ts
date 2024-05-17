import { createConsumer } from "rabbitmq"
import News from "../lib/News";

const embedding = async ({parsedPrompt}:{parsedPrompt: string}) => {
    return {result: await News.generateEmbedding(parsedPrompt)};
}

const embeddingConsumer = createConsumer({
    procedureName: "news/embedding",
    defaultQueue: "embedding",
    callback: embedding,
})

export default embeddingConsumer;