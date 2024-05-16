import { createConsumer } from "rabbitmq"
import { addSubsciber } from "../utils/subscriber";

const addSubscriberConsumer = createConsumer({
    procedureName: "subscription/addSubscriber",
    defaultQueue: "addSubscriber",
    callback: addSubsciber
})

export default addSubscriberConsumer;