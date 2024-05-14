import { createConsumer } from "rabbitmq"
import { readTheseNews } from "../utils/subscription";

const readNewsConsumer = createConsumer({
    procedureName: "news/readNews",
    defaultQueue: "readNews",
    callback: readTheseNews
})

export default readNewsConsumer;