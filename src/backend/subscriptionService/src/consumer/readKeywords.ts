import { createConsumer } from "rabbitmq"
import { readAllKeywords } from "../utils/subscription";

const readKeywordsConsumer = createConsumer({
    procedureName: "subscription/readKeywords",
    defaultQueue: "readKeywords",
    callback: readAllKeywords
})

export default readKeywordsConsumer;