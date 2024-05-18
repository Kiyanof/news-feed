import { createConsumer } from "rabbitmq"
import { readFeeds } from "../utils/subscription";

const readFeedConsumer = createConsumer({
    procedureName: "news/findRelevants",
    defaultQueue: "findRelevants",
    callback: readFeeds,
})

export default readFeedConsumer;