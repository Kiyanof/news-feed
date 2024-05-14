import { createConsumer } from "rabbitmq"
import { addSubsciber } from "src/utils/subscriber";

const addSubscriberConsumer = createConsumer({
    procedureName: "subscription/addSubscriber",
    defaultQueue: "addSubscriber",
    callback: addSubsciber
})

export default addSubscriberConsumer;