import { createConsumer } from "rabbitmq"
import { readFeeds } from "../utils/subscription";

const readFeedConsumer = createConsumer({
    procedureName: "news/readFeed",
    defaultQueue: "readFeed",
    callback: readFeeds,
})

export default readFeedConsumer;