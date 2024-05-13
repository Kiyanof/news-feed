import doForTheseSubscribers, { Frequency } from "../utils/subscriber";
import Rabbit from "rabbitmq";
import { RABBIT_URL } from "../config/rabbit.conf";
import findSubscriberNews from "../utils/news";
import sendSubscriberEmail from "../utils/notification";
import Caching from "../lib/caching/Caching";
import logger from "../config/logger";

const handleSubscribedUsersFeed = async (frequency: Frequency) => {
    const rabbit = Rabbit.new({
        url: RABBIT_URL
    })

    if(await rabbit.isReady()) {
        logger.info(`Broker is ready...`)
        logger.info(`Fetching ${frequency} subscribers...`)
        const caching = new Caching();
        doForTheseSubscribers(frequency, async (subscribers) => {
            for (const subscriber of subscribers) {
                const newsContent = await rabbit.callProcedure(findSubscriberNews, {frequency: frequency, parsedPrompt: subscriber.parsedPrompt})
                const isCached = await caching.cacheUserNews({
                    email: subscriber.email,
                    frequency: frequency,
                }, {
                    summery: newsContent.summery, 
                    newsID: newsContent.newsID
                })
                logger.info(`News cached for ${subscriber.email}: ${isCached}`)
                const isSent = await rabbit.callProcedure(sendSubscriberEmail, {to: subscriber.email, subject: '', message: newsContent.summery})
                logger.info(`Email sent to ${subscriber.email} with ${newsContent.summery.length} news: ${isSent}`)
            }
        }, {
            // callback props
        })
    } else {
        logger.warn(`Broker is not ready...`)
    }
}

export {
    handleSubscribedUsersFeed
}